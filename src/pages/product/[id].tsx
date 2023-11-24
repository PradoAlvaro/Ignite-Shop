import { ImageContainer, ProductContainer, ProductDetails } from '@/styles/pages/product'
import { GetStaticPaths, GetStaticProps, GetServerSideProps } from 'next'
import Image from 'next/image'
import {stripe} from '../../lib/stripe'
import Stripe from 'stripe'
import axios from 'axios'
import { useState } from 'react'
import Head from 'next/head'

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;

  }
}

export default function Product({ product}: ProductProps) {
  const [isCreatingCheckoutSession, setisCreatingCheckoutSession] = useState(false)


  async function handleBuyProduct() {
    try {
      setisCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout',{
        priceId: product.defaultPriceId
      })
      const { checkoutUrl} = response.data;

      window.location.href = checkoutUrl;
    } catch (err) {
      // Conectar com uma ferramenta de observabilidade (Datadog / Sentry)
      setisCreatingCheckoutSession(false)

      alert('Falha ao redirecionar para o checkout')
    }
  }
  
  return (
    <>
     <Head>
      <title>{product.name} | Ignite Shop</title>
    </Head>

     <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480}alt=''/>
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>     
        <span>{product.price}</span>     

        <p>{product.description}</p>
        <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>    
    </>
   
    )
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [
//       {params: {id:'prod_P1EXHKNINWAkDc'}}
//     ],
//     fallback: true
//   }
// }

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {
  const productId = params!.id
  console.log(productId)

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  });
  const price = product.default_price as Stripe.Price
  
  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0] || '',
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount! / 100),
        description: product.description,
        defaultPriceId: price.id,
      }
    }
  }
}