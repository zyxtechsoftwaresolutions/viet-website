import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react';

const FollowUsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 md:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient font-firlest" style={{ letterSpacing: '0.12em' }}>
              Follow Us @VIET
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Stay connected with our vibrant community and get the latest updates on campus life, 
              academic achievements, and exciting events.
            </p>
          </div>

          {/* Social Media Profiles */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Facebook */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Facebook className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Facebook</h3>
                    <p className="text-blue-100">@vietvizag</p>
                  </div>
                </div>
                <p className="text-blue-100 text-sm">
                  Connect with our community and stay updated with campus news, events, and achievements.
                </p>
              </div>
              
              {/* Facebook Feed Embed */}
              <div className="p-6">
                <div className="h-96 overflow-hidden rounded-lg">
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fvietvizag&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="VIET Facebook Feed"
                  ></iframe>
                </div>
                
                <a 
                  href="https://www.facebook.com/vietvizag" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  Follow on Facebook
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Instagram */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Instagram</h3>
                    <p className="text-pink-100">@visakha_college_official</p>
                  </div>
                </div>
                <p className="text-pink-100 text-sm">
                  See campus life through our visual stories, student achievements, and behind-the-scenes moments.
                </p>
              </div>
              
              {/* Instagram Feed Embed */}
              <div className="p-6">
                <div className="h-96 overflow-hidden rounded-lg">
                  <iframe
                    src="https://www.instagram.com/visakha_college_official/embed/"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="VIET Instagram Feed"
                  ></iframe>
                </div>
                
                <a 
                  href="https://www.instagram.com/visakha_college_official?igsh=MXcydnJ4ajMwd2MzMw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-pink-600 hover:to-red-600 transition-all"
                >
                  Follow on Instagram
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* LinkedIn */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">LinkedIn</h3>
                    <p className="text-blue-100">VIET Official</p>
                  </div>
                </div>
                <p className="text-blue-100 text-sm">
                  Professional networking, career opportunities, and industry insights for our students and alumni.
                </p>
              </div>
              
              {/* LinkedIn Profile Preview */}
              <div className="p-6">
                <div className="h-96 overflow-hidden rounded-lg bg-white border border-gray-200">
                  <div className="h-full flex flex-col">
                    {/* LinkedIn Header */}
                    <div className="bg-blue-700 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Linkedin className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Visakha Institute of Engineering & Technology</h4>
                          <p className="text-blue-100 text-sm">Educational Institution</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* LinkedIn Content Preview */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">V</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">VIET Official</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          🎓 We're excited to announce our new industry partnerships for 2025! 
                          These collaborations will provide our students with enhanced learning opportunities and better career prospects.
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>👍 45 likes</span>
                          <span>💬 8 comments</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">V</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">VIET Official</p>
                            <p className="text-xs text-gray-500">1 week ago</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          📚 Admissions are now open for the 2025-26 academic year. 
                          Apply now for B.Tech, M.Tech, MBA, MCA, BBA, and BCA programs.
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>👍 78 likes</span>
                          <span>💬 15 comments</span>
                        </div>
                      </div>
                      
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-3">See more posts on LinkedIn</p>
                        <a 
                          href="https://in.linkedin.com/school/visakha-institute-of-engineering-&-technology-57th-division-narava-pin--530027-cc-nt-/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
                        >
                          View Full Profile
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <a 
                  href="https://in.linkedin.com/school/visakha-institute-of-engineering-&-technology-57th-division-narava-pin--530027-cc-nt-/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors"
                >
                  Follow on LinkedIn
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-primary rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                Follow us on social media to stay connected with the VIET family. 
                Get updates on admissions, events, achievements, and campus life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://www.facebook.com/vietvizag" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass hover-glow-accent text-white border-white/20 px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </a>
                <a 
                  href="https://www.instagram.com/visakha_college_official?igsh=MXcydnJ4ajMwd2MzMw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass hover-glow-accent text-white border-white/20 px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
                <a 
                  href="https://in.linkedin.com/school/visakha-institute-of-engineering-&-technology-57th-division-narava-pin--530027-cc-nt-/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass hover-glow-accent text-white border-white/20 px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FollowUsSection;
