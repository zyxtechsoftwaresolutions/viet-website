import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, BookOpen, Target } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { icon: Users, number: '25,000+', label: 'Students' },
    { icon: BookOpen, number: '150+', label: 'Programs' },
    { icon: Award, number: '50+', label: 'Awards' },
    { icon: Target, number: '95%', label: 'Placement Rate' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <section id="about" className="py-20 bg-gradient-secondary" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              About VIET
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              For over five decades, VIET has been at the forefront of educational 
              excellence, fostering innovation, research, and holistic development 
              to create tomorrow's leaders.
            </p>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="interactive-card bg-card border border-border rounded-xl p-6 text-center hover-glow"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                Excellence in Education Since 1968
              </h3>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Visakha Institute of Engineering and Technology stands as a beacon 
                  of academic excellence, committed to nurturing bright minds and 
                  fostering innovation across diverse fields of study.
                </p>
                <p>
                  Our state-of-the-art facilities, world-class faculty, and 
                  industry partnerships create an environment where students 
                  don't just learn—they thrive, innovate, and lead.
                </p>
                <p>
                  From cutting-edge research laboratories to modern smart 
                  classrooms, every corner of our campus is designed to 
                  inspire learning and discovery.
                </p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="interactive-card bg-primary/5 border border-primary/20 rounded-xl p-6 hover-glow">
                  <h4 className="font-semibold text-primary mb-2">Innovation Hub</h4>
                  <p className="text-sm text-muted-foreground">
                    State-of-the-art research facilities and innovation centers
                  </p>
                </div>
                <div className="interactive-card bg-accent/5 border border-accent/20 rounded-xl p-6 hover-glow-accent">
                  <h4 className="font-semibold text-accent mb-2">Global Network</h4>
                  <p className="text-sm text-muted-foreground">
                    International partnerships and exchange programs
                  </p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="interactive-card bg-success/5 border border-success/20 rounded-xl p-6 hover-glow">
                  <h4 className="font-semibold text-success mb-2">Industry Connect</h4>
                  <p className="text-sm text-muted-foreground">
                    Strong ties with leading corporations and startups
                  </p>
                </div>
                <div className="interactive-card bg-primary/5 border border-primary/20 rounded-xl p-6 hover-glow">
                  <h4 className="font-semibold text-primary mb-2">Future Ready</h4>
                  <p className="text-sm text-muted-foreground">
                    Curriculum designed for tomorrow's challenges
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;