const HarvestManageRepository = require('../../repositories/admin/harvest-manage.repository');

/**
 * 收获管理服务类
 * 处理收获管理相关的业务逻辑，包括查询收获记录列表、创建和更新
 * 协调Repository层的数据访问
 */
class HarvestService {
  /**
   * 获取收获记录列表
   * 支持分页和筛选
   * 
   * @param {Object} query - 查询参数
   * @param {number} [query.page=1] - 页码，默认为1
   * @param {number} [query.limit=10] - 每页数量，默认为10
   * @param {number} [query.tree_id] - 树木ID筛选
   * @param {string} [query.harvest_batch] - 收获批次筛选
   * @returns {Promise<Object>} 返回包含收获记录列表和分页信息的对象
   */
  async getHarvests(query) {
    // 解析查询参数，设置默认值
    const { page = 1, limit = 10, treeId, status, harvestDate } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 调用Repository层查询收获记录列表
    const result = await HarvestManageRepository.findAll({
      limit,          // 每页数量
      offset,         // 偏移量
      tree_id: treeId,        // 树木ID筛选
      harvest_batch: status   // 收获批次筛选
    });

    // 转换字段名，使其与前端期望的一致
    const formattedData = result.data.map(harvest => ({
      id: harvest.id,
      treeId: harvest.tree_id,
      treeName: '', // 后端没有提供
      harvestDate: harvest.harvest_date,
      yield: harvest.yield,
      quality: harvest.quality_grade,
      status: harvest.harvest_batch === 'completed' ? 'completed' : 'pending',
      remark: '' // 后端没有提供
    }));

    // 返回查询结果（包含收获记录列表和分页信息）
    return {
      data: formattedData,
      pagination: result.pagination
    };
  }

  /**
   * 创建新的收获记录
   * 
   * @param {Object} harvestData - 收获数据
   * @param {number} harvestData.tree_id - 树木ID
   * @param {string} harvestData.harvest_batch - 收获批次
   * @param {Date} harvestData.harvest_date - 收获日期
   * @param {number} harvestData.yield - 产量（斤）
   * @param {string} harvestData.quality_grade - 质量等级
   * @param {string} harvestData.storage_location - 存放位置
   * @param {number} harvestData.operator_id - 操作员ID
   * @returns {Promise<Object>} 返回创建的收获记录对象
   */
  async createHarvest(harvestData) {
    // 转换前端参数为后端期望的格式
    const formattedData = {
      tree_id: harvestData.treeId,
      harvest_batch: harvestData.status,
      harvest_date: harvestData.harvestDate,
      yield: harvestData.yield,
      quality_grade: harvestData.quality,
      storage_location: harvestData.remark || '',
      operator_id: 1 // 临时设置为1，实际应该从登录用户获取
    };

    // 调用Repository层创建收获记录
    const result = await HarvestManageRepository.create(formattedData);

    // 转换返回数据为前端期望的格式
    return {
      id: result.id,
      treeId: result.tree_id,
      treeName: '', // 后端没有提供
      harvestDate: result.harvest_date,
      yield: result.yield,
      quality: result.quality_grade,
      status: result.harvest_batch,
      remark: '' // 后端没有提供
    };
  }

  /**
   * 更新收获记录
   * 
   * @param {number} harvestId - 收获记录ID
   * @param {Object} harvestData - 要更新的收获信息
   * @param {Date} [harvestData.harvest_date] - 收获日期
   * @param {number} [harvestData.yield] - 产量（斤）
   * @param {string} [harvestData.quality_grade] - 质量等级
   * @param {string} [harvestData.storage_location] - 存放位置
   * @returns {Promise<Object>} 返回更新后的收获记录对象
   */
  async updateHarvest(harvestId, harvestData) {
    // 转换前端参数为后端期望的格式
    const formattedData = {};
    if (harvestData.treeId) formattedData.tree_id = harvestData.treeId;
    if (harvestData.status) formattedData.harvest_batch = harvestData.status;
    if (harvestData.harvestDate) formattedData.harvest_date = harvestData.harvestDate;
    if (harvestData.yield) formattedData.yield = harvestData.yield;
    if (harvestData.quality) formattedData.quality_grade = harvestData.quality;
    if (harvestData.remark) formattedData.storage_location = harvestData.remark;

    // 调用Repository层更新收获记录
    const result = await HarvestManageRepository.update(harvestId, formattedData);

    // 转换返回数据为前端期望的格式
    return {
      id: result.id,
      treeId: result.tree_id,
      treeName: '', // 后端没有提供
      harvestDate: result.harvest_date,
      yield: result.yield,
      quality: result.quality_grade,
      status: result.harvest_batch,
      remark: '' // 后端没有提供
    };
  }
}

// 导出HarvestService的单例实例
module.exports = new HarvestService();