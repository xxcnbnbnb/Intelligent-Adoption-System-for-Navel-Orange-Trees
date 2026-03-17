const LogisticsRepository = require('../../repositories/user/logistics.repository');

class LogisticsService {
  async getLogisticsByAdoptionId(adoptionId) {
    const logistics = await LogisticsRepository.findByAdoptionId(adoptionId);
    
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
    
    const updateData = {
      logistics_company,
      logistics_no,
      status: 'shipped',
      send_time: new Date()
    };
    
    return await LogisticsRepository.update(id, updateData);
  }

  async receiveLogistics(id) {
    const logistics = await LogisticsRepository.findById(id);
    
    if (!logistics) {
      throw new Error('物流信息不存在');
    }
    
    if (logistics.status !== 'shipped') {
      throw new Error('只能签收已发货状态的物流');
    }
    
    const updateData = {
      status: 'received',
      receive_time: new Date()
    };
    
    return await LogisticsRepository.update(id, updateData);
  }

  async deleteLogistics(id) {
    const logistics = await LogisticsRepository.findById(id);
    
    if (!logistics) {
      throw new Error('物流信息不存在');
    }
    
    return await LogisticsRepository.softDeleteById(id);
  }
}

module.exports = new LogisticsService();
