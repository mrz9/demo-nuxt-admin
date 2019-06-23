<template>
  <div>
    <div class="filter-box">
      <el-form :inline="true" :model="filterForm" size="medium">
        <el-form-item>
          <el-input placeholder="关键字" v-model="filterForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" class="more" 
            :class="show_more_filter ? 'open': ''" 
            @click="show_more_filter = !show_more_filter">
            {{!show_more_filter ? '更多' : '收起'}}筛选条件 <i class="el-icon-d-arrow-left"></i></el-button>
        </el-form-item>
        <div class="more-items" v-if="show_more_filter">
          <el-form-item label="名字">
            <el-input placeholder="审批人"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select placeholder="类型">
              <el-option label="类型一" value="shanghai"></el-option>
              <el-option label="类型二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="text-center" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" style="width: 100%;"></el-time-picker>
          </el-col>
          </el-form-item>
        </div><!-- end more-items -->

      </el-form>
    </div><!-- end filter-box -->

    <div class="widget-box">
      <div class="widget-title">
        <h5 class="border">筛选结果</h5>
      </div>

      <div class="widget-content">
        <el-table
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
              fixed
              prop="id"
              label="ID"
              width="80">
            </el-table-column>
            <el-table-column
              prop="name"
              label="会员姓名">
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              width="200">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="comfirnDelete(scope.$index)" type="text" size="small">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
    </div><!-- end table-list --->

    <div class="footer">
      <div class="actions">
        <el-button type="danger" size="medium" @click="deleteMultip" :disabled="!multipleSelection.length">批量删除</el-button>
        <el-button type="primary" size="medium" @click="addMember">添加</el-button>
      </div>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div><!-- end pagination--->

    

    <!-- edit dialog -->
    <el-dialog title="编辑" :visible.sync="editDiablg.status" @close="cancelEditForm">
      <el-form label-width="80px" ref="ruleForm" :model="editDiablg.form" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editDiablg.form.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input type="age" v-model.number="editDiablg.form.age"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editDiablg.form.email"></el-input>
        </el-form-item>
         <el-form-item label="地址">
          <el-input v-model="editDiablg.form.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editFormSubmit">保存</el-button>
          <el-button @click="cancelEditForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterForm: {
        name: ''
      },
      show_more_filter:false,
      multipleSelection: [], //复选框选中
      tableData: [{
        id: '1',
        name: '测试一下',
        email: '111@163.com',
        age:12,
        address:'123ccadsf'
      }, {
        id: '2',
        name: '222',
        email: '111@163.com',
        age:12,
        address:'123ccadsf'
      }, {
        id: '3',
        name: 'test',
        email: 'owner888@163.com',
        age:12,
        address:'123ccadsf'
      }],
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        age: [
          { required: true, message: '年龄不能为空', trigger: 'blur' },
          { type: 'number', message: '年龄必须为数字值'}
        ],
       
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      editDiablg: {
        status: false,
        active: '',
        form: {
          name:'',
          age: '',
          email: '',
          address: ''
        }
      }
    }
  },
  methods: {
    comfirnDelete(index) {
      this.$confirm('确定要删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index,1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
                 
        });
    },
    edit(row) {
      this.editDiablg.active = row;
      for(let i in this.editDiablg.form){
        this.editDiablg.form[i] = row[i]
      }
      this.editDiablg.status = true;
    },
    editFormSubmit(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if(this.editDiablg.active){ // 编辑
            for(let i in this.editDiablg.form){
              this.editDiablg.active[i] = this.editDiablg.form[i]
            }
          }else { // 新镇
            this.tableData.push({...this.editDiablg.form, id: 99});
          }
          this.editDiablg.active = '';
          this.editDiablg.status = false;
        } else {
          return false;
        }
      });
    },
    cancelEditForm(){
      this.$refs.ruleForm.resetFields();
      this.editDiablg.status = false;
    },
    filterSubmit(){
      console.log('filterSubmit')
    },
    addMember(){
      this.editDiablg.active = '';
      for(let i in this.editDiablg.form){
        this.editDiablg.form[i] = '';
      }
      this.editDiablg.status = true;
    },
     handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleSelectionChange(val) { // table 复选框改变事件
      this.multipleSelection = val;
    },
    deleteMultip(){ // 批量删除
      if(!this.multipleSelection.length) return false;
      this.multipleSelection.forEach(select=>{
        let index = this.tableData.findIndex(item=>item.id == select.id);
        this.tableData.splice(index, 1);
      })
    }
  }
}
</script>

<style lang="less">
.filter-box {
  margin-bottom:10px;
  padding: 16px 20px 0;
  background-color:#fff;
  .el-form-item {
    margin-bottom: 16px;
  }
  .more {
    .el-icon-d-arrow-left {
      transition: transform .3s;
      transform: rotate(-90deg);
    }
    &.open {
      .el-icon-d-arrow-left {
        transform: rotate(90deg);
      }
    }
  }
}
.footer {
  padding:10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background-color: #fff;
  .pagination {
    overflow: hidden;
  }
}
</style>
