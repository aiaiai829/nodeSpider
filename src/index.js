const getHotNews = require('./cheerio')
const express = require('express')
const app = express()
const superagent = require('superagent')

let hotNews = []
let resData = []

/**
 *  jordan
 * [description] - 使用superagent.get()方法来访问网页
 */
let currentIndex = 0
let shutdownLength = 10000
function getData() {
  if (currentIndex >= shutdownLength) {
    resData = getHotNews(hotNews)
    return
  }
  superagent
    .get('https://www.footlocker.com/api/products/search')
    .query({
      query: ':relevance:brand:Jordan:productType:200005',
      currentPage: currentIndex,
      pageSize: 48,
      timestamp: 2
    })
    .set("accept", "application/json")
    .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36")
    .set("Referer", `https://www.footlocker.com/category/brands/jordan.html?query=%3Arelevance%3Abrand%3AJordan%3AproductType%3A200005&currentPage=${currentIndex}`)
    .end((err, res) => {
      if (err) {
        // 如果访问失败或者出错，
        console.log(`${currentIndex}抓取失败 - ${err}`)
        currentIndex++
        getData()
      } else {
        // 访问成功
        console.log(`${currentIndex}访问成功`)
        const { text = {} } = res
        const data = JSON.parse(text)
        const { products = [] } = data
        if (products.length < 48) {
          shutdownLength = currentIndex
        }
        hotNews = [...hotNews, ...products]
        currentIndex++
        getData()
      }
    })
}
getData()

let server = app.listen(10086, () => {
  let port = server.address().port

  console.log(`Your App is running at http://localhost:${port}`)
})

app.get('/', async (req, res) => {
  res.send(resData)
})
