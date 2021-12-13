<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card style="padding: 20px;">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="General" name="general">
                <general :user="user" />
              </el-tab-pane>
              <!-- <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane> -->
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import General from './components/General'

export default {
  name: 'Profile',
  components: { UserCard, Activity, General },
  data() {
    return {
      user: {},
      activeTab: 'general'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = this.userInfo;
      console.log('User info=>', this.userInfo)
    }
  }
}
</script>
