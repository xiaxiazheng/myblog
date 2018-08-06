<template>
  <div class="homecont">
		<div v-if="labelObj.label">
      <h1>{{labelObj.label}}</h1>
			<!-- <span v-if="labelObj.id">{{labelObj.id}}</span> -->
			<ul>
				<li v-for="(item, index) in contObj.list" :key="index">
					<h2>
						{{item.title}}
						<span v-if="contObj.list">
							修改时间：
							<span>{{item.motifytime}}</span>
						</span>
					</h2>
					<p v-html="item.cont" v-highlight></p>
				</li>
			</ul>
		</div>
		<div v-else>
			<h1>Welcome !</h1>
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
				apiUrl.getNodeCont(params).then(function(res) {
					self.contObj = res.data;
					for(let i in self.contObj.list) {
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/</g, "&lt;"); // html标签的<转成实体字符,让所有的html标签失效
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/&lt;pre/g, "<pre"); // 把pre标签转回来
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/&lt;\/pre>/g, "</pre>"); // 把pre结束标签转回来
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/>\n/g, ">");
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/  /g, "&nbsp;&nbsp;"); // 把空格转成实体字符，以防多空格被合并
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/\n|\r\n/g, "<br/>"); // 把换行转成br标签
					}
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
		padding: 10px;
		text-align: left;
		line-height: 1.5;
    h1 {
			margin-bottom: 10px;
			padding-right: 20px;
		}
		h2 {
			padding-bottom: .3rem;
			border-bottom: 1px solid #eaecef;
			position: relative;
			>span {
				position: absolute;
				right: 0;
				bottom: .3rem;
				font-size: .8rem;
				color: #999;
			}
		}
		ul {
			margin-top: 20px;
			li {
				margin: 20px 0;
			}
		}
		p {
			font-size: 1rem;
			line-height: 1.7;
			margin-bottom: .6rem;
		}
		pre {
			margin: 0;
			// color: white;
			// background-color: #23241f;
			overflow-x: auto;
			padding: 3px 1rem;
      white-space: pre;
			word-wrap: normal;
			border: 1px solid black;
			border-radius: .5rem;
			font-size: .859rem;
			font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace;
		}
  }
</style>
