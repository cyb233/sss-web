<template>
  <div class="app-container">
    <el-form ref="form" :model="searchForm" label-width="120px">
      <el-form-item label="监测区域">
        <el-select placeholder="请选择" v-model="searchForm.district_id" @change="fetchData(true)" style="width: 500px;">
          <el-option label="全部" :value='0' />
          <el-option v-for='(item,index) in districtList' :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="addAirQuality">添加记录</el-button>
    <el-table v-loading="listLoading" :data="airQualityList" element-loading-text="Loading" border fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="监测区域" width="110">
        <template slot-scope="scope">
          {{ districtById(scope.row.district_id) }}
        </template>
      </el-table-column>
      <el-table-column label="监测时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.monitor_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="PM10" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pm10 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="PM2.5" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pm2_5 }}
        </template>
      </el-table-column>
      <el-table-column label="监测站点" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.monitoring_station }}
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.last_modify_time }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="editAirQuality(scope.row)">编辑</el-button>
          <el-button type="danger" @click="beforeDelAirQuality(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--弹出层-->
    <el-dialog :title="tip" :visible.sync="outerVisible" style="height: 1000px;">
      <div>
        <el-form ref="form" :model="edit" :rules="dateRules" label-width="120px">
          <el-form-item label="id" v-show="false">
            <el-input style="width: 200px;" v-model="edit.id"></el-input>
          </el-form-item>
          <el-form-item label="监测区域">
            <el-select placeholder="请选择" v-model="edit.district_id" @change="fetchData" style="width: 500px;">
              <el-option v-for='(item,index) in districtList' :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="监测时间" prop="monitor_time">
            <el-input style="width: 200px;" v-model="edit.monitor_time"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="PM10">
            <el-input style="width: 200px;" v-model.number="edit.pm10" type="number"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="PM2.5">
            <el-input style="width: 200px;" v-model.number="edit.pm2_5" type="number"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="监测站点">
            <el-input style="width: 200px;" v-model="edit.monitoring_station"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="最后修改时间">
            <el-input style="width: 200px;" v-model="last_modify_time" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>

      <el-dialog width="30%" title="提示:" :visible.sync="innerVisible" append-to-body>
        <p>您确认{{tip}}吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="innerVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="updateAirQuality">确定</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取消</el-button>
        <el-button type="primary" @click="innerVisible = true">{{tip}}</el-button>
      </div>
    </el-dialog>

    <el-dialog width="30%" title="提示:" :visible.sync="thirdVisible" append-to-body>
      <p>您确认删除吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="thirdVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="delAirQuality">确定</el-button>
      </div>
    </el-dialog>

    <div style="width:90%;margin-top:30px;margin-left:30px">
      <!-- 分页 -->
      <el-pagination background :current-page="searchForm.pageNow" :page-sizes="[2,5,10,15]"
        :page-size="searchForm.pageSize" layout="total,prev,pager,next,jumper,sizes" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
  import {
    getInfo as getList
  } from '@/api/district'
  import {
    getInfo,
    addInfo,
    setInfo,
    delInfo
  } from '@/api/airQualityIndex'
  import {
    parseTime
  } from '@/utils'
  import {
    validDate
  } from '@/utils/validate'
  export default {
    data() {
      const validateDate = (rule, value, callback) => {
        if (!validDate(value)) {
          callback(new Error('Please enter the correct date, like "yyyy-MM-dd HH:mm:ss"'))
        } else {
          callback()
        }
      }
      return {
        searchForm: {
          district_id: 0,
          pageNow: 1, // 当前页
          pageSize: 5
        },
        edit: {
          id: 0,
          district_id: 0,
          monitor_time: '',
          pm10: 0,
          pm2_5: 0,
          monitoring_station: ''
        },
        dateRules: {
          monitor_time: [{
            required: true,
            trigger: 'blur',
            validator: validateDate
          }]
        },
        districtList: null,
        airQualityList: null,
        data: null,
        listLoading: true,
        total: 0, // 总数据条数
        outerVisible: false,
        innerVisible: false,
        thirdVisible: false,
        last_modify_time: '',
        tip: '',
        delId: 0,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      districtById(id) {
        let name = ''
        this.districtList.forEach((item, index) => {
          if (item.id == id) {
            name = item.name
          }
        })
        return name
      },
      fetchData(param) {
        if (param === true) {
          this.searchForm.pageNow = 1
        }
        this.listLoading = true
        getList().then(response => {
          this.districtList = response.data
        })
        getInfo(this.searchForm).then(response => {
          this.data = response.data
          this.airQualityList = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      addAirQuality: function() {
        this.edit.id = 0;
        this.edit.district_id = 1;
        this.edit.monitor_time = '';
        this.edit.pm10 = 0;
        this.edit.pm2_5 = 0;
        this.edit.monitoring_station = '';
        this.last_modify_time = '';
        this.tip = '添加'
        this.outerVisible = true;
      },
      editAirQuality: function(row) {
        this.edit.id = row.id;
        this.edit.district_id = row.district_id;
        this.edit.monitor_time = row.monitor_time;
        this.edit.pm10 = row.pm10;
        this.edit.pm2_5 = row.pm2_5;
        this.edit.monitoring_station = row.monitoring_station;
        this.last_modify_time = row.last_modify_time;
        this.tip = '修改'
        this.outerVisible = true;
      },
      updateAirQuality: function() {
        if (this.edit.id == 0) {
          addInfo(this.edit).then(response => {
            this.innerVisible = false;
            this.outerVisible = false;
            this.fetchData()
          })
        } else {
          setInfo(this.edit).then(response => {
            this.innerVisible = false;
            this.outerVisible = false;
            this.fetchData()
          })
        }
      },
      beforeDelAirQuality: function(id) {
        this.delId = id;
        this.thirdVisible = true;
      },
      delAirQuality: function() {
        delInfo({
          id: this.delId
        }).then(response => {
          this.thirdVisible = false;
          this.fetchData()
        })
      },
      handleSizeChange: function(size) {
        this.searchForm.pageSize = size
        this.fetchData()
      },
      handleCurrentChange: function(pageNow) {
        this.searchForm.pageNow = pageNow
        this.fetchData()
      },
      onSubmit: function() {
        this.fetchData()
      }
    }
  }
</script>
