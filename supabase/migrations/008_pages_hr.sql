-- Seed HR leader page so admin can edit it (same structure as Chairman/Principal)
INSERT INTO pages (slug, title, route, category, content)
VALUES (
  'hr',
  'HR',
  '/hr',
  'About',
  '{
    "hero": {
      "title": "HR",
      "description": "Human Resources at VIET — nurturing talent and building a thriving institutional culture.",
      "buttonText": "Read message"
    },
    "profile": {
      "name": "HR",
      "qualification": "",
      "designation": "HR",
      "badge": "Human Resources"
    },
    "message": "<p>Welcome to the <strong>Human Resources</strong> section of Visakha Institute of Engineering & Technology (VIET). Our HR team is dedicated to fostering a supportive and inclusive environment for all faculty and staff.</p><p>We focus on talent development, employee well-being, and building a culture of collaboration and growth.</p>",
    "inspiration": {
      "quote": "People are your most important asset. Invest in them.",
      "author": "Anonymous"
    },
    "greetings": {
      "text": "Wish you all the best,"
    }
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
