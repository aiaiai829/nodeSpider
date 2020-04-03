# nodeSpider
node爬虫，爬取footlocker球鞋名称、鞋码、图片、价格、在售情况

主要思路是循环爬取所有分页的AJ，再循环爬取对应购买页的码数 价格等详细信息，footlocker有反爬，频率过高会封IP，有兴趣的同学可以搞个免费的IP池

（目前项目比较忙，只抓取了所有在售AJ，包括男码女码和大童，后面会集成mangoDB，实时监控热门鞋款的上新和补货）

npm i

node src/index.js

Chrome安装JSONView便于查看抓取数据 ~


![部分数据](https://github.com/TomLeel/nodeSpider/blob/master/1585884066.jpg?raw=true)
