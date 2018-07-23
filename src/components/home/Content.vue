<template>
  <div class="content"><!-- 这是前端展示页面的主Vue -->
		<div v-if="labelObj.label">
      <h1>{{labelObj.label}}</h1>
			hello
			<span v-if="labelObj.id">{{labelObj.id}}</span>
			<ul>
				<li v-for="(item, index) in dataObj" :key="index">
					<h2>{{item.title}}</h2>
					<p>{{item.cont}}</p>
				</li>
			</ul>
		</div>
		<div v-else>
			nothing
		</div>
  </div>
</template>

<script>
import { dataObject } from '@/mock.js'

export default {
	props: ['labelObj'],
  data() {
    return {
      dataObj: []
    }
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	methods: {
		init() {
      this.dataObj = dataObject;
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .content {
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
