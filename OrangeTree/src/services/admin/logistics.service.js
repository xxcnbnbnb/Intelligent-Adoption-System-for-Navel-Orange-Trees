const LogisticsRepository = require('../../repositories/user/logistics.repository');
const Logistics = require('../../models/user/logistics.model');
const { user: userDb } = require('../../config/database.config');

class LogisticsService {
  async getLogisticsList(options = {}) {
    const { page = 1, limit = 10, status, adoption_id } = options;
    const offset = (page - 1) * limit;
    
    let query = Logistics.query()
      .orderBy('created_at', 'desc');
    
    if (status) {
      query = query.where('status', status);
    }
    
    if (adoption_id) {
      query = query.where('adopt_id', adoption_id);
    }
    
    const data = await query
      .limit(limit)
      .offset(offset);
    
    const total = await Logistics.query()
      .resultSize();
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getLogisticsById(id) {
    const logistics = await LogisticsRepository.findById(id);
    
    if (!logistics) {
      throw new Error('物流信息不存在');
    }
    
    return logistics;
  }

  async createLogistics(data) {
    const { adopt_id, harvest_batch, product_amount, receiver_name, receiver_phone, receiver_address, logistics_company, logistics_no } = data;
    
    if (!adopt_id) {
      throw new Error('认养订单ID不能为空');
    }
    
    if (!receiver_name) {
      throw new Error('收货人姓名不能为空');
    }
    
    if (!receiver_phone) {
      throw new Error('收货人电话不能为空');
    }
    
    if (!receiver_address) {
      throw new Error('收货地址不能为空');
    }
    
    const logisticsData = {
      adopt_id,
      harvest_batch: harvest_batch || null,
      product_amount: product_amount || null,
      receiver_name,
      receiver_phone,
      receiver_address,
      logistics_company: logistics_company || null,
      logistics_no: logistics_no || null,
      status: 'pending'
    };
    
    return await LogisticsRepository.create(logisticsData);
  }

  async updateLogistics(id, data) {
    const logistics = await LogisticsRepository.findById(id);
    
    if (!logistics) {
      throw new Error('物流信息不存在');
    }
    
    return await LogisticsRepository.update(id, data);
  }

  async shipLogistics(id, data) {
    const logistics = await LogisticsRepository.findById(id);
    
    if (!logistics) {
      throw new Error('物流信息不存在');
    }
    
    if (logistics.status !== 'pending') {
      throw new Error('只能发货待发货状态的物流');
    }
    
    const { logistics_company, logistics_no } = data;
    
    if (!logistics_company) {
      throw new Error('物流公司不能为空');
    }
    
    if (!logistics_no) {
      throw new Error('物流单号不能为空');
    }
    
    const sendTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await userDb('user_logistics')
      .where('id', id)
      .update({
        logistics_company,
        logistics_no,
        status: 'shipped',
        send_time: sendTime
      });
    
    return await LogisticsRepository.findById(id);
  }

  async deleteLogistics(id) {
    const logistics = await LogisticsRepository.findById(id);
    
    if (!logistics) {
      throw new Error('物流信息不存在');
    }
    
    return await LogisticsRepository.deleteById(id);
  }
}

module.exports = new LogisticsService();