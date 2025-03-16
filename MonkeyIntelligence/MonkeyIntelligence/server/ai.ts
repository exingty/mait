// Simple algorithms for generating educational content

interface LessonPlan {
  title: string;
  objectives: string[];
  activities: string[];
  assessment: string[];
}

export async function generateLesson(subject: string, yearGroup: string): Promise<LessonPlan> {
  // Convert year group to educational stage
  const stage = yearGroup.toLowerCase().startsWith('year') ? 
    parseInt(yearGroup.replace('year', '')) : 
    yearGroup.toLowerCase() === 'reception' ? 0 : null;

  const getStageLevel = () => {
    if (stage === null) return "primary";
    if (stage === 0) return "early_years";
    if (stage <= 6) return "primary";
    if (stage <= 11) return "secondary";
    return "sixth_form";
  };

  const level = getStageLevel();

  const templates = {
    Mathematics: {
      early_years: {
        topics: ["Numbers to 20", "Simple Addition", "Shapes and Patterns"],
        activities: ["Counting Games", "Number Songs", "Shape Sorting"]
      },
      primary: {
        topics: ["Place Value", "Times Tables", "Fractions"],
        activities: ["Number Games", "Mental Maths", "Problem Solving"]
      },
      secondary: {
        topics: ["Algebra", "Geometry", "Statistics"],
        activities: ["Equation Practice", "Geometric Constructions", "Data Analysis"]
      },
      sixth_form: {
        topics: ["Advanced Functions", "Calculus", "Mechanics"],
        activities: ["Complex Problems", "Mathematical Modelling", "Exam Practice"]
      }
    },
    Science: {
      early_years: {
        topics: ["Living Things", "Materials", "Seasons"],
        activities: ["Nature Walks", "Simple Experiments", "Weather Watch"]
      },
      primary: {
        topics: ["Plants and Animals", "Forces", "Materials"],
        activities: ["Growing Plants", "Simple Machines", "Material Testing"]
      },
      secondary: {
        topics: ["Chemistry Basics", "Physics Laws", "Biology Systems"],
        activities: ["Lab Work", "Scientific Investigation", "Research Projects"]
      },
      sixth_form: {
        topics: ["Organic Chemistry", "Quantum Physics", "Molecular Biology"],
        activities: ["Advanced Practicals", "Research Analysis", "Scientific Papers"]
      }
    }
  };

  const subjectTemplates = templates[subject as keyof typeof templates]?.[level] || {
    topics: ["General Knowledge"],
    activities: ["Reading and Discussion"]
  };

  const topic = subjectTemplates.topics[Math.floor(Math.random() * subjectTemplates.topics.length)];
  const activity = subjectTemplates.activities[Math.floor(Math.random() * subjectTemplates.activities.length)];

  return {
    title: `${topic} for ${yearGroup}`,
    objectives: [
      `Understand key concepts of ${topic}`,
      `Develop skills in ${subject} problem-solving`,
      "Practice critical thinking and analysis"
    ],
    activities: [
      activity,
      "Group Discussion and Review",
      "Practice Problems and Exercises"
    ],
    assessment: [
      "Class Participation",
      "Homework Tasks",
      "End of Unit Assessment"
    ]
  };
}

// Enhanced rule-based educational AI assistant
export async function getAIResponse(prompt: string): Promise<string> {
  const promptLower = prompt.toLowerCase();

  // Math subject patterns
  const mathPatterns = {
    // Basic Math
    "add": "Let's work through this addition step by step! Start by lining up the numbers vertically, making sure to align the place values (ones under ones, tens under tens, etc). Would you like an example?",
    "subtract": "For subtraction, remember to check if you need to borrow from the next column. What numbers are you working with?",
    "multiply": "Multiplication can be broken down into smaller steps. Let's start with the basic multiplication table - which numbers are you trying to multiply?",
    "divide": "Division is like sharing equally. First, let's identify the divisor and dividend. Which numbers are you working with?",

    // Algebra
    "equation": "With equations, always keep them balanced! Whatever you do to one side, you must do to the other. What kind of equation are we solving?",
    "variable": "Variables are like containers that can hold different values. In your equation, what letter represents the unknown value?",
    "solve": "Let's solve this systematically! First, let's identify what we're solving for, then follow these steps:\n1. Simplify each side\n2. Get variables on one side\n3. Get numbers on the other\n4. Solve for the variable",

    // Geometry
    "geometry": "Geometry is all about shapes and their properties. Are we working with 2D shapes (like triangles) or 3D shapes (like cubes)?",
    "triangle": "There are three main types of triangles: equilateral (all sides equal), isosceles (two sides equal), and scalene (no sides equal). Which one are you studying?",
    "area": "To find area, we need to know the shape. Different shapes have different formulas. What shape are you working with?",

    // Advanced Math
    "fraction": "When working with fractions, remember these rules:\n1. To add/subtract: find common denominator\n2. To multiply: multiply numerators and denominators\n3. To divide: multiply by the reciprocal\nWhich operation are you doing?",
    "percentage": "Percentages are parts per hundred. To convert to decimal, divide by 100. To find a percentage of a number, convert to decimal and multiply. What percentage problem are you working on?"
  };

  // Science subject patterns
  const sciencePatterns = {
    // Biology
    "cell": "Cells are the building blocks of life! They have many parts like:\n- Nucleus (control center)\n- Mitochondria (power house)\n- Cell membrane (protective barrier)\nWhich part are you studying?",
    "organism": "Living things can be classified into groups based on their characteristics. Are we talking about plants, animals, fungi, or bacteria?",
    "ecosystem": "Ecosystems are communities of living things interacting with their environment. Let's explore the food chains, habitats, and relationships between species!",

    // Chemistry
    "element": "The periodic table organizes elements based on their properties. Each element has a unique atomic number and electron configuration. Which element are you studying?",
    "reaction": "Chemical reactions involve:\n1. Reactants → Products\n2. Energy changes\n3. Conservation of mass\nWhat type of reaction are you looking at?",
    "molecule": "Molecules are formed when atoms bond together. The type of bond (ionic, covalent, or metallic) depends on the atoms involved. What molecules are you studying?",

    // Physics
    "force": "Forces can be:\n- Pushes or pulls\n- Balanced or unbalanced\n- Measured in Newtons\nWhat forces are acting in your problem?",
    "energy": "Energy comes in many forms:\n- Kinetic (motion)\n- Potential (stored)\n- Thermal (heat)\n- Electrical\nWhich type are we discussing?",
    "motion": "Motion can be described using:\n- Speed (distance/time)\n- Velocity (speed with direction)\n- Acceleration (change in velocity)\nWhat aspect of motion are you studying?"
  };

  // English subject patterns
  const englishPatterns = {
    // Writing
    "essay": "Let's structure your essay:\n1. Introduction (hook + thesis)\n2. Body paragraphs (topic sentences + evidence)\n3. Conclusion (restate + reflect)\nWhere would you like to start?",
    "grammar": "Good grammar helps communicate clearly. Are we working with:\n- Verb tenses?\n- Subject-verb agreement?\n- Punctuation?\n- Sentence structure?\nWhat's causing the issue?",
    "write": "Strong writing needs:\n1. Clear main idea\n2. Supporting details\n3. Logical organization\n4. Proper grammar\nWhat are you writing about?",

    // Reading
    "read": "When reading, try these strategies:\n1. Preview the text\n2. Ask questions while reading\n3. Summarize main points\n4. Make connections\nWhat are you reading?",
    "analyze": "Let's analyze the text by looking at:\n- Theme (main message)\n- Characters\n- Plot\n- Literary devices\nWhat aspect would you like to explore?",
    "comprehension": "To improve comprehension:\n1. Read actively\n2. Visualize the content\n3. Make predictions\n4. Ask questions\nWhat part is challenging?"
  };

  // History subject patterns
  const historyPatterns = {
    "date": "Historical events are connected! Let's create a timeline and see what else was happening around this time. What period are we studying?",
    "event": "To understand historical events, let's look at:\n1. Causes (what led to it?)\n2. Key figures involved\n3. Impact on society\n4. Long-term effects\nWhich event are we discussing?",
    "person": "Historical figures shaped their times through:\n- Actions and decisions\n- Ideas and innovations\n- Leadership and influence\nWho are we learning about?",
    "period": "Each historical period has:\n- Distinct characteristics\n- Important developments\n- Cultural changes\n- Lasting impacts\nWhich era are we exploring?"
  };

  // Study skills and general help
  const generalPatterns = {
    "help": "I can help you learn effectively! Let's identify:\n1. The subject you're studying\n2. Specific topics you need help with\n3. Your learning goals\nWhat would you like to focus on?",
    "understand": "Understanding improves when you:\n1. Explain concepts in your own words\n2. Connect ideas to what you know\n3. Apply knowledge to new situations\nWhat are you trying to understand?",
    "explain": "I'll break this down into simpler parts and use examples to help you understand. Which part should we start with?",
    "example": "Examples help connect theory to practice. I can provide step-by-step solutions and real-world applications. What kind of example would be most helpful?",
    "practice": "Practice makes perfect! We can:\n1. Start with basic examples\n2. Gradually increase difficulty\n3. Review and correct mistakes\nReady to begin?",
    "stuck": "Don't worry! Let's:\n1. Identify the specific challenge\n2. Break it into smaller parts\n3. Solve one step at a time\nWhere would you like to start?",
    "test": "To prepare for tests:\n1. Review key concepts\n2. Practice sample problems\n3. Identify weak areas\n4. Use active recall\nWhat subject is the test on?",
    "study": "Effective study strategies include:\n1. Active recall (self-testing)\n2. Spaced repetition\n3. Teaching others\n4. Making connections\nWhich method would you like to try?"
  };

  // Question type patterns
  const questionPatterns = {
    "what": "Let me explain the concept. First, could you share what you already know about this topic?",
    "how": "I'll guide you through this step by step. What's your goal or what are you trying to achieve?",
    "why": "Understanding the 'why' helps build deeper knowledge. Let's explore the reasoning together.",
    "when": "Timing and sequence are important. Let's put this in context - what do you know about the timeframe?",
    "where": "Location and context can help us understand better. What environment or setting are we discussing?",
    "which": "Let's compare the options to make an informed choice. What are the alternatives you're considering?",
    "who": "People and their roles are important to understand. Are we discussing a specific person or group?",
    "can": "Yes, I can help you with that! Let's break down what you'd like to accomplish.",
    "could": "Absolutely! I'd be happy to help. What specific aspect would you like to focus on?",
    "would": "I'm here to assist! Let's explore your question together. What's your main concern?",
    "should": "Let's analyze this situation together. What factors are you considering?"
  };

  // Combine all patterns
  const allPatterns = {
    ...mathPatterns,
    ...sciencePatterns,
    ...englishPatterns,
    ...historyPatterns,
    ...generalPatterns,
    ...questionPatterns
  };

  // First, check for question words
  const questionWords = ["what", "how", "why", "when", "where", "which", "who", "can", "could", "would", "should"];
  for (const word of questionWords) {
    if (promptLower.startsWith(word)) {
      const response = questionPatterns[word];
      return response;
    }
  }

  // Then check for subject-specific patterns
  for (const [keyword, response] of Object.entries(allPatterns)) {
    if (promptLower.includes(keyword)) {
      return response;
    }
  }

  // Subject detection with detailed responses
  if (promptLower.includes("math")) {
    return "I can help you master mathematics! We can work on:\n1. Basic operations (+-×÷)\n2. Algebra and equations\n3. Geometry and shapes\n4. Fractions and decimals\nWhat topic would you like to explore?";
  } else if (promptLower.includes("science")) {
    return "Let's explore science together! We can cover:\n1. Biology (living things)\n2. Chemistry (matter and reactions)\n3. Physics (forces and energy)\n4. Earth Science\nWhat area interests you?";
  } else if (promptLower.includes("english")) {
    return "I can help improve your English skills! We can work on:\n1. Writing (essays, stories)\n2. Reading comprehension\n3. Grammar and vocabulary\n4. Literary analysis\nWhat would you like to focus on?";
  } else if (promptLower.includes("history")) {
    return "History is like a fascinating story! We can explore:\n1. Ancient civilizations\n2. Important events\n3. Historical figures\n4. Cultural changes\nWhich aspect interests you most?";
  }

  // If no specific pattern is matched, analyze the question to provide a relevant response
  const words = promptLower.split(' ');
  let responsePrefix = "I understand you're asking about ";
  let topic = words.find(word => 
    ["learn", "study", "understand", "explain", "help", "know", "practice"].includes(word)
  ) || "this topic";

  return `${responsePrefix}${topic}. Let's explore it together! To help you better, could you:\n` +
         "1. Specify the subject area (math, science, english, history)\n" +
         "2. Share what you already know about this\n" +
         "3. Tell me what aspect you find most challenging\n" +
         "This will help me provide more targeted assistance!";
}