import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: '88th Division, Narava, GVMC, Visakhapatnam, Andhra Pradesh 530027'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+91 731 2588999'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'website@viet.edu.in'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: 'Mon - Fri: 9:00 AM - 5:00 PM'
    }
  ];

  return (
    <section id="contact" className="py-12 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-gradient font-firlest" style={{ letterSpacing: '0.12em' }}>
              Get In Touch
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Have questions about admissions, programs, or campus life? 
              We're here to help you every step of the way.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Contact Information
              </h3>
              
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  className="interactive-card bg-card border border-border rounded-lg p-4 hover-glow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">
                        {info.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {info.details}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-gradient-primary rounded-lg p-4 text-white"
              >
                <h4 className="font-semibold mb-3 text-sm">Campus Location</h4>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg h-32 flex items-center justify-center">
                  <p className="text-center opacity-80 text-sm">
                    Interactive Campus Map<br />
                    <span className="text-xs">Coming Soon</span>
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Send us a Message
              </h3>
              
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      First Name
                    </label>
                    <Input 
                      placeholder="Your first name"
                      className="hover:border-primary/50 focus:border-primary transition-colors h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Last Name
                    </label>
                    <Input 
                      placeholder="Your last name"
                      className="hover:border-primary/50 focus:border-primary transition-colors h-9 text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Email
                  </label>
                  <Input 
                    type="email"
                    placeholder="your.email@example.com"
                    className="hover:border-primary/50 focus:border-primary transition-colors h-9 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Subject
                  </label>
                  <Input 
                    placeholder="What is this regarding?"
                    className="hover:border-primary/50 focus:border-primary transition-colors h-9 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us how we can help you..."
                    rows={4}
                    className="hover:border-primary/50 focus:border-primary transition-colors resize-none text-sm"
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-gradient-primary hover-glow text-white border-0 py-2 text-sm font-semibold"
                >
                  Send Message
                </Button>
              </form>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Prefer to talk? Call us at{' '}
                  <span className="text-primary font-medium">+91 731 2588999</span>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;