const LogisticsService = require('../../services/admin/logistics.service');

class LogisticsController {
  async getLogisticsList(req, res, next) {
    try {
      const { page = 1, limit = 10, status, adoption_id } = req.query;
      const logistics = await LogisticsService.getLogisticsList({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        adoption_id
      });
      
      res.status(200).json({
        success: true,
        data: logistics.data,
        pagination: logistics.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getLogisticsById(req, res, next) {
    try {
      const { id } = req.params;
      const logistics = await LogisticsService.getLogisticsById(id);
      
      res.status(200).json({
        success: true,
        data: logistics
      });
    } catch (error) {
      if (error.message === '物流信息不存在') {
        return res.status(404).json({
          success: false,
          message: '物流信息不存在'
        });
      }
      next(error);
    }
  }

  async createLogistics(req, res, next) {
    try {
      const logistics = await LogisticsService.createLogistics(req.body);
      
      res.status(201).json({
        success: true,
        message: '创建物流信息成功',
        data: logistics
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLogistics(req, res, next) {
    try {
      const { id } = req.params;
      const logistics = await LogisticsService.updateLogistics(id, req.body);
      
      res.status(200).json({
        success: true,
        message: '更新物流信息成功',
        data: logistics
      });
    } catch (error) {
      if (error.message === '物流信息不存在') {
        return res.status(404).json({
          success: false,
          message: '物流信息不存在'
        });
      }
      next(error);
    }
  }

  async shipLogistics(req, res, next) {
    try {
      const { id } = req.params;
      const logistics = await LogisticsService.shipLogistics(id, req.body);
      
      res.status(200).json({
        success: true,
        message: '发货成功',
        data: logistics
      });
    } catch (error) {
      if (error.message === '物流信息不存在') {
        return res.status(404).json({
          success: false,
          message: '物流信息不存在'
        });
      }
      next(error);
    }
  }

  async deleteLogistics(req, res, next) {
    try {
      const { id } = req.params;
      await LogisticsService.deleteLogistics(id);
      
      res.status(200).json({
        success: true,
        message: '删除物流信息成功'
      });
    } catch (error) {
      if (error.message === '物流信息不存在') {
        return res.status(404).json({
          success: false,
          message: '物流信息不存在'
        });
      }
      next(error);
    }
  }
}

module.exports = new LogisticsController();