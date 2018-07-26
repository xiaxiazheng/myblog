<template>
  <div class="homecont"><!-- 这是前端展示页面的主Vue -->
		<div v-if="labelObj.label">
      <h1>{{labelObj.label}}</h1>
			<h2>
				修改时间：
				<span v-if="contObj.motifytime">{{contObj.motifytime}}</span>
			</h2>
			<span v-if="labelObj.id">{{labelObj.id}}</span>
			<ul>
				<li v-for="(item, index) in contObj.list" :key="index">
					<h2>{{item.title}}</h2>
					<p>{{item.cont}}</p>
				</li>
			</ul>
		</div>
		<div v-else>
			<h2>Welcome !</h2>
		</div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
// import { dataObject } from '@/mock.js'

export default {
	props: ['labelObj'],
  data() {
    return {
      contObj: []
    }
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	watch: {
    labelObj() {
			this.init();
		}
	},
	methods: {
		init() {
			// this.contObj = dataObject;
			if(this.labelObj) {
				var self = this,
						params = {
							id: this.labelObj.id, // 子节点的id
						};
				apiUrl.getANode(params).then(function(res) {
					self.contObj = res.data;
				}).catch(function(res) {
					console.log(res.message);
				});
			}
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .homecont {
		text-align: left;
		padding: 10px;
    h1 {
			font-size: 2.2rem;
      margin-bottom: 10px;
		}
		h2 {
			font-size: 1.65rem;
			padding-bottom: .3rem;
			border-bottom: 1px solid #eaecef;
		}
		p {
			font-size: 1.4rem;
			text-indent: 2rem;
			line-height: 1.7;
			margin: .5rem 0;
		}
  }
</style>
