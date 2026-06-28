import React from 'react'
import { Helmet } from 'react-helmet-async'

const SEO = ({ 
  title = "PYQ Hub - Previous Year Question Papers", 
  description = "A free, premium platform for students to browse, download, and share previous year question papers. Ace your exams with PYQ Hub.", 
  keywords = "PYQ, previous year questions, exams, student resources, university papers"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  )
}

export default SEO
