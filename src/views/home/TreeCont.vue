<template>
  <div class="treecont">
		<div v-if="$route.query.id !== ''">
      <h1>{{title}}</h1>
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
					<div v-if="item.filename" class="imgbox">
            <img 
						  :src="baseImgUrl + item.filename"
							:alt="getRealImgName(item.filename)"
							@click="showBigImg(baseImgUrl + item.filename, getRealImgName(item.filename))"
							title="点击查看大图">
						<span>{{ getRealImgName(item.filename) }}</span>
					</div>
				</li>
			</ul>
			<!-- 图片看大图 -->
			<el-dialog :visible.sync="dialogVisible" :title="dialogImageName">
				<img width="100%" :src="dialogImageUrl" :alt="dialogImageName" :title="dialogImageName">
			</el-dialog>
		</div>
		<div v-else>
			<TreeMain type="home"></TreeMain>
		</div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import { baseUrl } from '@/config.js'
import TreeMain from '@/components/TreeMain'

export default {
	props: ['isPC', 'propsname'],
  data() {
    return {
			title: '',
			contObj: [],
			baseImgUrl: baseUrl + '/treecont/',
			dialogVisible: false,
			dialogImageName: '',
			dialogImageUrl: '',
    }
	},
	components: {
		TreeMain
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	watch: {
		propsname() {
			this.title = this.propsname;
		},
		"$route"() {
			this.init();
		}
	},
	methods: {
		init() {
			if(this.$route.query.id) {
				var self = this,
						params = {
							id: decodeURIComponent(atob(this.$route.query.id)), // 子节点的id
						};
				// 获取当前节点名称
				apiUrl.getChildName(params).then(function(res) {
					self.title = res.data[0].c_label;
				}).catch(function(res) {
					self.$message({
						type: 'error',
						message: '初始化出错'
					});
				});
				apiUrl.getNodeCont(params).then(function(res) {
					self.contObj = res.data;
					for(let i in self.contObj.list) {
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/</g, "&lt;"); // html标签的<转成实体字符,让所有的html标签失效
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/&lt;pre/g, "<pre"); // 把pre标签转回来
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/pre>\n/g, "pre>");  // 把pre后面的空格去掉
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/&lt;\/pre>/g, "</pre>"); // 把pre结束标签转回来
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/  /g, "&nbsp;&nbsp;"); // 把空格转成实体字符，以防多空格被合并
						self.contObj.list[i].cont = self.contObj.list[i].cont.replace(/\n|\r\n/g, "<br/>"); // 把换行转成br标签
					}
				}).catch(function(res) {
					self.$message({
						type: 'error',
						message: '初始化出错'
					});
				});
			}
		},
		/* 获取文件原本的名称，没有id没有后缀那种 */
		getRealImgName(filename) {
			if(filename) {
				let list = filename.split('.');
				let filetype = list[list.length - 1]; // 文件类型
				let randomNum = list[list.length - 2];
				let originname = filename.substr(0, filename.length - filetype.length - randomNum.length - 2 - decodeURIComponent(atob(this.$route.query.id)).length);
				return originname;
			}
		},
		/* 点击查看大图 */
		showBigImg(imgurl, imgname) {
			this.dialogImageUrl = imgurl;
			this.dialogImageName = imgname;
			this.dialogVisible = true;
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .treecont {
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
				color: #ccc;
			}
		}
		ul {
			margin-top: 20px;
			li {
				margin: 20px 0;
				.imgbox {
					height: 314px;
					margin: 0 auto;
					overflow: hidden;
					text-align: center;
					img {
						display: inherit;
						height: calc(100% - 14px);
						margin: 0 auto;
						cursor: pointer;
					}
					span {
						font-size: 12px;
						color: #ccc;
					}
				}
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
