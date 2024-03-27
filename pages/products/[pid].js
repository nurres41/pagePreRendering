import React, { Fragment } from 'react'
import fs from 'fs/promises'
import path from 'path'

const ProductDetailPage = (props) => {
    const { data } = props

    if (!data) {
        return <p>Loading...</p>
    }

  return (
    <Fragment>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
    </Fragment>
  )
}

async function getData() {
    const filePath = path.join(process.cwd(), 'data', 'dummy-data.json')
    const jsonData = await fs.readFile(filePath)
    const data = JSON.parse(jsonData)
    return data
}

export async function getStaticProps(context) {
    const { params } = context
    const data = await getData()
    const productId = params.pid;

    const product = data.products.find(item => item.id === productId)

    if(!product) {
        return { notFound: true }
    }

    return {
        props: {
            data: product
        }
    }
}

// fallback: true ile bazi sayfalari istek geldiginde render edebiliriz. 
// az ziyaret edilen sayfalari boylelikle bosu bosuna pre-render etmemis oluruz.
// sadece pre-render edilmesini istedigimiz sayfalari getStaticPaths icinde tanimlayip, fallback: true yaparsak sadece o sayfalar pre-render olur.
// -----
// boyle bir yaklasimda bulunursak, pre-render edilmemis sayfalar yuklenirken propslarimiz pass edilmemis yani yuklenmemis olabilir.
// bu nedenle component icinde bunu kontrol etmek bir loading veya skeleton koymak gerekebilir.
// -----
// dinamik bir route oldugu icin getStaticProps kullanmak istersek olasi routelari alttaki ozel fonk ile tanimlamaliyiz.
// belirtilen sayfalar olusturulur. Kullanici bu sayfalara gidince servera istek atilmaz. SPA gibi react calisir. 
// inspect icinde bu datalari gorebiliriz. Network datada.
// -----
// fallback 'blocking' de kullanabiliriz. Bu sayfanin tamamen yuklenmesini bekler. 
// fallback false oldugu zaman eger render edilecek sayfa paths icinde yoksa notFound sayfasi render olur.
// fallback true ise her sayfa render edilebilinir. paths icinde olmayan bir sayfa dahi. Bu risklidir. Sayfanin gecerli olup olmadigini kontrol etmek gerekir.

export async function getStaticPaths() {
    const data = await getData()
    // array olusur.
    const ids = data.products.map(product => product.id)
    // array icinde object donebilmesi icin ekstra () ile { params: { pid: id }} sardik. Eger kullanmasak array icinde undefined doner. 
    const pathsWithParams = ids.map((id) => ({ params: { pid: id}}))
    console.log("🚀 ~ getStaticPaths ~ pathsWithParams:", pathsWithParams)
    
    return {
        paths: pathsWithParams,
        fallback: false
    }
}

export default ProductDetailPage

// getStaticProps ile getServerSideProps arasindaki en onemli fark surecleridir.
// getStaticProps build aninda ele alinir iken getServerSideProps proje deploy edildikten sonra requestlerden sonra ele alinir.

// ornegin kullanici username veya idsi ile yapilan bir sayfa icin getServerSideProps kullanilir. Cunku hangi kullanicinin gelecegini bilemeyiz.
// bunun icin server side islem yapariz. o da her requestte calisacak getServerSideProps sayesinde olur. 
