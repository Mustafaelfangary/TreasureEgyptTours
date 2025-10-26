'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, ChevronRight, Share2, BookOpen, Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  mainImageUrl?: string;
  heroImageUrl?: string;
  author: string;
  tags: string[];
  category?: string;
  isPublished: boolean;
  featured: boolean;
  publishedAt?: string;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

type PharaohButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; children: ReactNode };

const PharaohButton = ({ children, className = '', ...props }: PharaohButtonProps) => (
  <Button
    className={`relative overflow-hidden bg-gradient-to-r from-ocean-blue to-deep-blue hover:from-ocean-blue-dark hover:to-deep-blue text-black font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    {...props}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
  </Button>
);

type AnimatedSectionProps = { children: ReactNode; animation?: 'fade-up' | 'fade-left' | 'fade-right'; delay?: number };

const AnimatedSection = ({ children, animation = 'fade-up', delay = 0 }: AnimatedSectionProps) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      y: animation === 'fade-up' ? 50 : 0,
      x: animation === 'fade-left' ? -50 : animation === 'fade-right' ? 50 : 0 
    }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    transition={{ duration: 0.8, delay: delay / 1000 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  
  useEffect(() => {
    if (!params.slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${params.slug}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          }
        });

        if (response.status === 404) {
          notFound();
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setBlog(data);

          // Fetch related blogs
          if (data.category || data.tags.length > 0) {
            try {
              const r = await fetch('/api/blogs');
              if (r.ok) {
                const allBlogs = await r.json();
                const related = allBlogs
                  .filter((b: Blog) => b.id !== data.id)
                  .filter((b: Blog) => 
                    b.category === data.category || 
                    b.tags.some((tag: string) => data.tags.includes(tag))
                  )
                  .slice(0, 3);
                setRelatedBlogs(related);
              }
            } catch (e) {
              console.error('Error fetching related blogs:', e);
            }
          }
        } else {
          console.error('Failed to load blog post');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  const fetchRelatedBlogs = async (currentBlog: Blog) => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const allBlogs = await response.json();
        const related = allBlogs
          .filter((b: Blog) => b.id !== currentBlog.id)
          .filter((b: Blog) => 
            b.category === currentBlog.category || 
            b.tags.some(tag => currentBlog.tags.includes(tag))
          )
          .slice(0, 3);
        setRelatedBlogs(related);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ocean-blue-dark mx-auto mb-4"></div>
          <p className="text-ocean-blue-dark text-lg">Loading Ancient Blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">𓂀</div>
          <h1 className="text-2xl font-bold text-ocean-blue-dark mb-4">Blog Not Found</h1>
          <p className="text-ocean-blue-dark mb-6">This ancient blog could not be found.</p>
          <PharaohButton onClick={() => window.location.href = '/blogs'}>
            ← Back to All Blogs
          </PharaohButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pale-green-50 to-pale-blue-50 on-light">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-ocean-blue-dark via-deep-blue to-navy-blue text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {blog.heroImageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${blog.heroImageUrl})` }}
          ></div>
        )}
        <div className="absolute inset-0 bg-[url('/images/hieroglyphic-pattern.png')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <div className="mb-8">
                <PharaohButton 
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  onClick={() => window.location.href = '/blogs'}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blogs
                </PharaohButton>
              </div>

              {/* Category Badge */}
              {blog.category && (
                <div className="mb-6">
                  <span className="bg-white/20 text-blue-200 px-4 py-2 rounded-full text-sm font-semibold">
                    {blog.category}
                  </span>
                </div>
              )}

              <h1 id="blog-title" className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {blog.title}
              </h1>
              
              {blog.excerpt && (
                <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                  <User className="w-5 h-5 mr-2" />
                  {blog.author}
                </div>
                {blog.publishedAt && (
                  <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                    <Calendar className="w-5 h-5 mr-2" />
                    {new Date(blog.publishedAt).toLocaleDateString()}
                  </div>
                )}
                {blog.readTime && (
                  <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                    <Clock className="w-5 h-5 mr-2" />
                    {blog.readTime} min read
                  </div>
                )}
              </div>

              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="bg-ocean-blue/20 text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <PharaohButton className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Blog
                </PharaohButton>
                <PharaohButton className="bg-ocean-blue hover:bg-ocean-blue-dark text-black">
                  <Heart className="w-5 h-5 mr-2" />
                  Save to Favorites
                </PharaohButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Image */}
      {blog.mainImageUrl && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up">
              <div className="max-w-4xl mx-auto">
                <Image
                  src={blog.mainImageUrl || '/images/default-blog.jpg'}
                  alt={blog.title}
                  width={800}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg shadow-2xl border-4 border-blue-200"
                  priority
                />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection animation="fade-up">
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl">
                <CardContent className="p-8 md:p-12">
                  <div id="blog-content"
                    className="prose prose-lg max-w-none prose-headings:text-ocean-blue-dark prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-ocean-blue-dark prose-a:font-semibold prose-strong:text-ocean-blue-dark prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-blue-100 to-blue-100">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up">
              <h2 className="text-4xl font-bold text-center text-ocean-blue-dark mb-12">
                📜 Related Blogs 📜
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedBlogs.map((relatedBlog, index) => (
                <AnimatedSection key={relatedBlog.id} animation="fade-up" delay={index * 100}>
                  <Link href={`/blogs/${relatedBlog.slug || relatedBlog.id}`}>
                    <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-ocean-blue overflow-hidden h-full cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedBlog.mainImageUrl || '/images/default-blog.jpg'}
                          alt={relatedBlog.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      {relatedBlog.category && (
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {relatedBlog.category}
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 flex flex-col h-full">
                      <h3 className="text-lg font-bold text-ocean-blue-dark mb-3 group-hover:text-ocean-blue-dark transition-colors line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {relatedBlog.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {relatedBlog.author}
                        </div>
                        {relatedBlog.readTime && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {relatedBlog.readTime} min
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <PharaohButton className="w-full text-sm">
                          Read Blog
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </PharaohButton>
                      </div>
                    </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-ocean-blue-dark via-deep-blue to-navy-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold mb-6">
              Discover More Ancient Blogs
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Explore our collection of blogs and immerse yourself in the timeless stories 
              and secrets of ancient Egypt.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/blogs">
                <PharaohButton className="bg-white text-ocean-blue-dark hover:bg-blue-50">
                  <BookOpen className="w-5 h-5 mr-2" />
                  All Blogs
                </PharaohButton>
              </Link>
              <PharaohButton 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = '/itineraries'}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Sacred Journeys
              </PharaohButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    {Array.isArray(blog.tags) && blog.tags.includes('speakable') && (
        <Script
          id="blog-speakable-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com'}/blogs/${blog.slug}`,
              speakable: {
                "@type": "SpeakableSpecification",
                cssSelector: ["#blog-title", "#blog-content p:nth-of-type(1)"]
              }
            })
          }}
        />
      )}
    </div>
  );
}
