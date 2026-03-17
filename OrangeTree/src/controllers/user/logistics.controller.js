const LogisticsService = require('../../services/user/logistics.service');

class LogisticsController {
  async getLogistics(req, res, next) {
    try {
      const { adoptionId } = req.params;
      const logistics = await LogisticsService.getLogisticsByAdoptionId(adoptionId);
      
      res.status(200).json({
        success: true,
        data: logistics
      });
    } catch (error) {
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
      next(error);
    }
  }

  async receiveLogistics(req, res, next) {
    try {
      const { id } = req.params;
      const logistics = await LogisticsService.receiveLogistics(id);
      
      res.status(200).json({
        success: true,
        message: '确认收货成功',
        data: logistics
      });
    } catch (error) {
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
      next(error);
    }
  }
}

module.exports = new LogisticsController();
