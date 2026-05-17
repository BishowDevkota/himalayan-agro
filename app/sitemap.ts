import type { MetadataRoute } from 'next'
import connectToDatabase from './lib/mongodb'
import Product from './models/Product'
import Outlet from './models/Outlet'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectToDatabase()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Static routes
  const staticRoutes = ['', '/about', '/about-us/who-we-are', '/about-us/executive-team', '/about-us/expert-team', '/about-us/board-of-directors', '/about-us/investor-relations', '/shop', '/contact', '/investor', '/news', '/gallery', '/outlet', '/login', '/register', '/cart', '/checkout', '/my-orders'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' || route === '/shop' ? 1.0 : 0.8,
  }))

  // Product routes
  const products = await Product.find({ isActive: true }).select('_id name').lean()
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product._id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Outlet routes
  const outlets = await Outlet.find().select('_id name').lean()
  const outletRoutes = outlets.map((outlet) => ({
    url: `${baseUrl}/outlet/${outlet._id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // News routes (if needed)
  // const news = await News.find().select('_id slug').lean()
  // const newsRoutes = news.map((article) => ({
  //   url: `${baseUrl}/news/${article.slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.5,
  // }))

  return [...staticRoutes, ...productRoutes, ...outletRoutes]
}