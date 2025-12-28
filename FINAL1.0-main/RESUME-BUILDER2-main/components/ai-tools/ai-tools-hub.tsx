"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Linkedin, MessageSquare, Zap, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CoverLetterGenerator } from "./cover-letter-generator"
import { LinkedInBioGenerator } from "./linkedin-bio-generator"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function AIToolsHub() {
  const [showChatbot, setShowChatbot] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hello! I'm your AI Career Assistant. I can help you with:\n\n✨ Resume optimization tips\n💼 Cover letter suggestions\n🎯 Career advice\n📝 LinkedIn profile enhancement\n🎤 Interview preparation\n\nHow can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [showQuestions, setShowQuestions] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)

  const quickReplies = [
    { label: "Resume Tips", value: "resume tips" },
    { label: "Cover Letter", value: "cover letter" },
    { label: "Career Advice", value: "career advice" },
    { label: "LinkedIn Help", value: "linkedin help" },
    { label: "Interview Prep", value: "interview preparation" },
  ]

  const interviewQuestions = [
    {
      id: 1,
      question: "Tell me about yourself",
      answer: `**Perfect Answer Structure:**

1. **Present (30 sec):** Current role and key responsibilities
   "I'm currently a [Role] at [Company], where I [key achievement/responsibility]"

2. **Past (30 sec):** Relevant background and experience
   "Before this, I worked at [Previous Company] where I [notable accomplishment]"

3. **Future (30 sec):** Why you're interested in this role
   "I'm excited about this opportunity because [specific reason related to the role]"

**Example:**
"I'm a Full-Stack Developer with 3 years of experience building scalable web applications. Currently at TechCorp, I lead the development of a customer portal that serves 50K+ users. Previously, I worked at StartupXYZ where I built their entire backend infrastructure from scratch. I'm excited about this role because I'm passionate about solving complex problems at scale, and your company's mission to revolutionize [industry] really resonates with me."

**Tips:**
• Keep it under 2 minutes
• Be authentic and conversational
• Connect your story to the role
• End with enthusiasm about THIS opportunity`
    },
    {
      id: 2,
      question: "What are your greatest strengths?",
      answer: `**How to Answer:**

Choose 2-3 strengths that are:
✓ Relevant to the job description
✓ Backed by specific examples
✓ Show impact/results

**Structure:**
1. State the strength
2. Give a specific example
3. Show the result/impact

**Example Answer:**

"One of my greatest strengths is **problem-solving**. For instance, at my last company, we had a critical system outage affecting 10K users. I quickly identified the root cause in our caching layer, implemented a fix within 2 hours, and then created monitoring alerts to prevent similar issues. This reduced our downtime by 80% that quarter.

Another strength is my ability to **communicate complex technical concepts** to non-technical stakeholders. I regularly present to executives and have successfully secured budget approvals for 3 major projects by translating technical requirements into business value."

**Strong Strengths to Mention:**
• Problem-solving with examples
• Leadership and mentoring
• Adaptability to change
• Technical expertise in [specific area]
• Communication and collaboration
• Time management and prioritization

Remember: Always back it up with PROOF!`
    },
    {
      id: 3,
      question: "What is your greatest weakness?",
      answer: `**Strategy: Show Self-Awareness + Growth**

**The Formula:**
1. Identify a real (but not critical) weakness
2. Explain what you're doing to improve
3. Show progress you've already made

**Example Answer:**

"Early in my career, I struggled with **delegating tasks**. I felt I needed to do everything myself to ensure quality. However, I realized this was limiting both my team's growth and my ability to focus on strategic work.

To improve, I started:
• Identifying team members' strengths and matching tasks accordingly
• Setting clear expectations and checkpoints
• Trusting the process and stepping back

As a result, I've successfully delegated 3 major projects this year, and my team has grown more confident and skilled. I still check in regularly, but I've learned to trust my team's capabilities."

**Good Weaknesses to Mention:**
❌ AVOID: "I'm a perfectionist" or "I work too hard"
✅ GOOD:
• Public speaking (with Toastmasters training)
• Patience with slow processes (learning agile methods)
• Saying no (now using priority frameworks)
• Technical skill you're actively learning

**Key:** Show you're self-aware and actively improving!`
    },
    {
      id: 4,
      question: "Why do you want to work here?",
      answer: `**What They're Really Asking:**
• Did you research our company?
• Are you genuinely interested or just job hunting?
• Will you stay long-term?

**Answer Structure:**

1. **Company-Specific Reason** (50%)
   Research their mission, products, culture, recent news

2. **Role-Specific Reason** (30%)
   How this position aligns with your career goals

3. **Personal Connection** (20%)
   What excites YOU about this opportunity

**Example Answer:**

"I'm really excited about this opportunity for three main reasons:

First, I've been following [Company]'s work in [specific area], particularly your recent [product/initiative]. Your approach to [specific thing] is innovative and aligns with where I see the industry heading.

Second, this role combines my experience in [skill 1] and [skill 2] while giving me the opportunity to grow in [new area]. The challenges you're tackling around [specific problem] are exactly what I want to solve in my career.

Finally, your company culture of [specific value from research] resonates strongly with me. I've seen reviews from current employees about [specific aspect], and that's the type of environment where I thrive."

**Do Your Homework:**
• Read recent news/press releases
• Check their LinkedIn, blog, social media
• Review their mission/values page
• Look at their products/services
• Check employee reviews (Glassdoor)

**Pro Tip:** Mention something specific that competitors DON'T have!`
    },
    {
      id: 5,
      question: "Where do you see yourself in 5 years?",
      answer: `**What They Want to Know:**
• Are you committed or just passing through?
• Are your goals realistic?
• Does this role fit your career path?

**What NOT to Say:**
❌ "I want YOUR job"
❌ "I'll probably go back to school"
❌ "I want to start my own company"
❌ "I don't know" or overly specific titles

**Answer Strategy:**

Focus on:
✓ Skills you want to develop
✓ Impact you want to make
✓ General growth trajectory
✓ Value you'll bring to the company

**Example Answer:**

"In five years, I see myself as a **technical leader** in [specific area relevant to the company]. I want to deepen my expertise in [relevant skill] and mentor junior developers on the team.

I'm particularly interested in [company's focus area], and I'd love to be someone who helps drive innovation in that space. I see myself taking on increasing responsibility, possibly leading larger projects or a small team.

Most importantly, I want to be in an environment where I'm constantly learning and making meaningful contributions. Based on what I've learned about [Company]'s growth trajectory and focus on [specific thing], I believe there will be great opportunities to grow here."

**Alternative Approach (More Specific):**

"In 5 years, I aim to:
• Become a subject matter expert in [relevant domain]
• Lead cross-functional projects that impact [business metric]
• Mentor 3-5 junior team members
• Contribute to [company initiative] at a strategic level

This role seems like the perfect foundation to start that journey."

**Remember:** Show ambition without seeming like you'll leave soon!`
    },
    {
      id: 6,
      question: "Why did you leave your last job?",
      answer: `**Golden Rules:**
❌ NEVER badmouth previous employer
❌ NEVER mention conflicts/drama
❌ NEVER focus on negatives

✅ Frame it POSITIVELY about growth

**Safe, Professional Answers:**

**If Still Employed:**
"I'm grateful for my time at [Company] and have learned a lot, but I'm looking for new challenges in [specific area]. This role offers [specific opportunity] that I'm excited about."

**If Left for Growth:**
"I had reached a ceiling in terms of growth at my previous role. I was looking for opportunities to [skill/responsibility], and this position offers exactly that challenge."

**If Laid Off/Company Issues:**
"The company underwent restructuring and my position was eliminated along with [X%] of the team. I'm grateful for the experience I gained there in [skills], and I'm now looking to apply those skills in a more stable, growing environment like yours."

**If Cultural Misfit:**
"While I learned valuable skills at [Company], I realized I thrive in environments that [value that THIS company has]. From my research, your company culture emphasizes [specific thing], which aligns perfectly with how I work best."

**If Better Opportunity:**
"I wasn't actively looking, but when I learned about this opportunity with [Company], I couldn't pass it up. The chance to work on [specific project/technology] and contribute to [company mission] was too compelling."

**If Short Tenure (< 1 year):**
"I took the role hoping it would involve [X], but it turned out to be more focused on [Y]. I realized quickly this wasn't the right fit, and rather than waste anyone's time, I decided to find a role that better matches my skills in [relevant area], like this one."

**Pro Tips:**
• Keep it brief (30 seconds max)
• Pivot to why THIS role is better
• Show what you learned from the experience
• Focus on the FUTURE, not the past`
    },
    {
      id: 7,
      question: "Describe a challenging situation and how you handled it",
      answer: `**Use the STAR Method:**

**S**ituation - Set the context (20%)
**T**ask - Explain your responsibility (10%)
**A**ction - Describe what YOU did (50%)
**R**esult - Share the outcome with metrics (20%)

**Example Answer:**

**Situation:**
"At my previous company, we had a major product launch scheduled in 2 weeks, but our QA team discovered critical bugs that would typically take 4 weeks to fix."

**Task:**
"As the lead developer, I was responsible for ensuring we launched on time without compromising quality."

**Action:**
"I took several steps:
1. Prioritized bugs by impact - identified 5 critical vs. 15 nice-to-haves
2. Reorganized the team into pairs to tackle critical issues faster
3. Implemented daily standups to catch blockers early
4. Negotiated with product to move some features to v1.1
5. Personally worked extra hours on the most complex bug
6. Set up automated regression tests to prevent similar issues"

**Result:**
"We launched on time with all critical bugs fixed. The product received 4.5/5 stars in first reviews, zero critical post-launch issues, and exceeded first-week download targets by 30%. The pairing strategy worked so well we adopted it permanently, reducing bug resolution time by 40%."

**More Example Scenarios:**

**Conflict Resolution:**
- Disagreement with colleague
- Team member not performing
- Client unhappy with deliverable

**Tight Deadlines:**
- Impossible timeline
- Resource constraints
- Competing priorities

**Technical Challenges:**
- System failure/outage
- Complex problem no one could solve
- Learning new technology quickly

**Leadership:**
- Taking initiative on project
- Mentoring struggling team member
- Driving change in process

**Keys to Success:**
✓ Pick a story with a POSITIVE outcome
✓ Focus on YOUR actions (not "we")
✓ Use specific numbers/metrics
✓ Show problem-solving and leadership
✓ End with what you LEARNED

**Practice 3-4 STAR stories before interviews!**`
    },
    {
      id: 8,
      question: "Do you have any questions for us?",
      answer: `**ALWAYS Ask Questions - It Shows:**
• You did research
• You're genuinely interested  
• You're evaluating fit too
• You're thinking strategically

**❌ NEVER Ask:**
- "What does your company do?" (research!)
- Salary/benefits in first interview
- "How did I do?" or "Did I get the job?"
- Anything answered on their website
- "No, I'm good" (NEVER say this!)

**✅ GREAT Questions to Ask:**

**About the Role:**
1. "What does success look like in this role in the first 90 days?"
2. "What are the biggest challenges someone in this position would face?"
3. "Can you walk me through a typical day/week?"
4. "How is performance measured for this role?"
5. "Why is this position open? New role or backfill?"

**About the Team:**
6. "Can you tell me about the team I'd be working with?"
7. "What's the team's dynamic and collaboration style?"
8. "How does this role interact with other departments?"
9. "What do you enjoy most about working with this team?"

**About Growth:**
10. "What opportunities are there for professional development?"
11. "What's the career path for someone in this role?"
12. "How does the company support continued learning?"
13. "Are there mentorship programs available?"

**About the Company:**
14. "What are the company's goals for the next year?"
15. "How would you describe the company culture?"
16. "What makes your top performers successful here?"
17. "What's the biggest challenge the company is facing right now?"

**Strategic Questions:**
18. "What's the vision for [department] in the next 2-3 years?"
19. "How does this role contribute to the company's key objectives?"
20. "What emerging technologies/trends are you most excited about?"

**To the Interviewer Personally:**
21. "What's your favorite thing about working here?"
22. "What surprised you most after joining the company?"
23. "How long have you been here, and what's kept you?"

**Next Steps:**
24. "What are the next steps in the interview process?"
25. "When can I expect to hear back?"
26. "Is there anything about my background you'd like me to clarify?"

**Pro Tips:**
• Prepare 8-10 questions
• Ask 3-4 per interview (they'll answer some)
• Take notes during their answers
• Ask follow-up questions
• Save compensation talk for later rounds
• Show enthusiasm in your questions!

**The Best Question:**
"Based on our conversation, do you have any concerns about my fit for this role that I can address?"
(Shows confidence and gives you a chance to overcome objections!)`
    }
  ]

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()

    if (msg.includes("interview") || msg.includes("preparation") || msg.includes("prep")) {
      setShowQuestions(true)
      return `🎤 **Interview Preparation - Common Questions:**

I've prepared detailed answers for 8 most common interview questions. Click on any question below to see the complete answer with examples and tips!`
    }

    if (msg.includes("resume") || msg.includes("cv")) {
      return `📄 **Resume Optimization Tips:**

1. **Use Action Verbs**: Start bullet points with powerful verbs like "Led," "Developed," "Increased," "Managed"

2. **Quantify Achievements**: Include numbers and metrics
   • "Increased sales by 35%" vs "Responsible for sales"

3. **Tailor for Each Job**: Customize your resume to match job descriptions using relevant keywords

4. **Keep it Concise**: Aim for 1-2 pages, use bullet points for easy scanning

5. **ATS-Friendly Format**: Use standard fonts, avoid tables/images in content areas

6. **Skills Section**: List both hard and soft skills relevant to your target role

7. **Professional Summary**: Write a compelling 2-3 line summary at the top

Would you like specific help with any section?`
    }

    if (msg.includes("cover letter")) {
      return `💼 **Cover Letter Suggestions:**

1. **Personalize the Opening**: Address the hiring manager by name when possible

2. **Strong First Paragraph**: Hook them with why you're excited about THIS specific role

3. **Showcase Achievements**: Pick 2-3 relevant accomplishments from your resume and expand on them

4. **Company Research**: Mention specific things about the company that resonate with you

5. **Connect Your Skills**: Directly link your experience to their requirements

6. **Call to Action**: End with enthusiasm and request for an interview

7. **Keep it Brief**: Max 3-4 paragraphs, one page

**Template Structure:**
• Para 1: Why this role excites you
• Para 2-3: Your relevant achievements & skills
• Para 4: Thank you & call to action

Need help with a specific cover letter?`
    }

    if (msg.includes("career") || msg.includes("advice") || msg.includes("job")) {
      return `🎯 **Career Advice:**

**Job Search Strategy:**
• Apply to 10-15 targeted positions weekly
• Network on LinkedIn (comment, share, connect)
• Set up job alerts on multiple platforms
• Follow up on applications after 1 week

**Skills Development:**
• Identify in-demand skills in your field
• Take online courses (Coursera, Udemy, LinkedIn Learning)
• Build a portfolio of projects
• Stay updated with industry trends

**Interview Preparation:**
• Research the company thoroughly
• Prepare STAR method stories for common questions
• Practice with mock interviews
• Prepare thoughtful questions for the interviewer

**Salary Negotiation:**
• Research market rates for your role
• Wait for them to make the first offer
• Focus on your value, not personal needs
• Be prepared to walk away if needed

What specific career challenge can I help with?`
    }

    if (msg.includes("linkedin") || msg.includes("profile")) {
      return `📝 **LinkedIn Profile Enhancement:**

1. **Professional Photo**: Use a high-quality headshot with a plain background

2. **Compelling Headline**: More than just job title
   • Bad: "Software Engineer"
   • Good: "Full-Stack Developer | Building Scalable Web Apps | React & Node.js"

3. **About Section**: Write in first person, tell your story
   • Who you are, what you do, what you're passionate about
   • Include keywords for SEO
   • Add a call-to-action

4. **Experience Section**: Mirror your resume but can be more detailed
   • Use media (images, links, presentations)
   • Highlight achievements with metrics

5. **Skills & Endorsements**: List 20+ relevant skills, prioritize top 3

6. **Recommendations**: Request from colleagues, managers, clients

7. **Engagement**: Post regularly, comment on others' content, share insights

8. **Custom URL**: Change to linkedin.com/in/yourname

9. **Featured Section**: Showcase your best work, articles, projects

Want help optimizing a specific section?`
    }

    if (msg.includes("thank") || msg.includes("thanks")) {
      return "You're welcome! 😊 Feel free to ask anything else about your career development. I'm here to help!"
    }

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello! 👋 How can I assist you with your career today? Ask me about resumes, cover letters, career advice, or LinkedIn!"
    }

    return `I can help you with:

✨ Resume optimization tips
💼 Cover letter suggestions  
🎯 Career advice
📝 LinkedIn profile enhancement

Just ask me about any of these topics, and I'll provide detailed guidance!`
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 500)
  }

  const handleQuickReply = (value: string) => {
    setInputMessage(value)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleDeleteLastMessage = () => {
    if (lastMessageId) {
      setMessages((prev) => prev.filter((msg) => msg.id !== lastMessageId))
      setLastMessageId(null)
    } else {
      // If no specific message tracked, remove last bot message
      setMessages((prev) => {
        const lastBotIndex = prev.map((m, i) => (m.sender === "bot" ? i : -1)).filter((i) => i !== -1).pop()
        if (lastBotIndex !== undefined) {
          return prev.filter((_, i) => i !== lastBotIndex)
        }
        return prev
      })
    }
  }

  const handleRenewChat = () => {
    setMessages([
      {
        id: "1",
        text: "👋 Hello! I'm your AI Career Assistant. I can help you with:\n\n✨ Resume optimization tips\n💼 Cover letter suggestions\n🎯 Career advice\n📝 LinkedIn profile enhancement\n🎤 Interview preparation\n\nHow can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ])
    setInputMessage("")
    setShowQuestions(false)
    setSelectedQuestion(null)
    setLastMessageId(null)
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/1715371733808.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(2,6,23,0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">AI Tools</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AI-Powered Career Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Leverage artificial intelligence to create compelling career documents and optimize your professional
            presence
          </p>
        </div>

        <Tabs defaultValue="cover-letter" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-800 to-slate-900 p-2 rounded-2xl border border-slate-700">
            <TabsTrigger 
              value="cover-letter" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <FileText className="h-4 w-4" />
              <span>Cover Letter</span>
            </TabsTrigger>
            <TabsTrigger 
              value="linkedin-bio" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn Bio</span>
            </TabsTrigger>
            <TabsTrigger 
              value="interview-prep" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Interview Prep</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cover-letter" className="mt-8">
            <CoverLetterGenerator />
          </TabsContent>

          <TabsContent value="linkedin-bio" className="mt-8">
            <LinkedInBioGenerator />
          </TabsContent>

          <TabsContent value="interview-prep" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_50%)]" />
                <CardHeader className="text-center relative z-10">
                  <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                    <MessageSquare className="h-8 w-8 text-emerald-400" />
                  </div>
                  <CardTitle className="flex items-center justify-center space-x-2 text-white text-2xl">
                    <span>Interview Preparation Assistant</span>
                  </CardTitle>
                  <CardDescription className="text-gray-300 mt-2">
                    Coming soon! AI-powered interview question generator and practice sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12 relative z-10">
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-8 border border-emerald-500/20">
                    <MessageSquare className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-white">Interview Prep Tool</h3>
                    <p className="text-gray-300 mb-4">
                      This feature is currently in development. Soon you'll be able to:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-2 max-w-md mx-auto text-left">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                        Generate common interview questions for your role
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                        Practice with AI-powered mock interviews
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                        Get feedback on your answers
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                        Prepare for behavioral and technical questions
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating AI Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showChatbot ? (
          <button
            onClick={() => setShowChatbot(true)}
            className="group relative"
            aria-label="Open AI Assistant"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-2xl hover:scale-110 transition-transform duration-300">
              <img
                src="/AI-Job.avif"
                alt="AI Assistant"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl w-96 max-h-[600px] flex flex-col overflow-hidden border-2 border-primary/20">
            {/* Chatbot Header */}
            <div 
              className="p-4 text-white relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
              }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                    <img
                      src="/AI-Job.avif"
                      alt="AI Assistant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Career Assistant</h3>
                    <p className="text-xs opacity-90">Online • Ready to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteLastMessage}
                    className="text-white hover:bg-white/20"
                    title="Delete last message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRenewChat}
                    className="text-white hover:bg-white/20"
                    title="Renew chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChatbot(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chatbot Body */}
            <div className="flex-1 p-4 bg-gray-50 overflow-y-auto max-h-[400px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.sender === "user" ? "justify-end" : ""}`}
                  >
                    {message.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src="/AI-Job.avif"
                          alt="AI"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl p-3 shadow-sm max-w-[85%] ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-primary to-accent text-white rounded-tr-none"
                          : "bg-white rounded-tl-none"
                      }`}
                    >
                      <p className={`text-sm whitespace-pre-line ${message.sender === "user" ? "text-white" : "text-gray-800"}`}>
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Interview Questions List - Show when triggered */}
                {showQuestions && (
                  <div className="mt-4 pl-10">
                    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
                      {interviewQuestions.map((q) => (
                        <button
                          key={q.id}
                          onClick={() => {
                            setSelectedQuestion(q.id)
                            const messageId = Date.now().toString()
                            const answerMessage: Message = {
                              id: messageId,
                              text: `**${q.question}**\n\n${q.answer}`,
                              sender: "bot",
                              timestamp: new Date(),
                            }
                            setMessages((prev) => [...prev, answerMessage])
                            setLastMessageId(messageId)
                          }}
                          className="w-full text-left px-4 py-3 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 rounded-lg border border-primary/20 transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                              {q.id}
                            </span>
                            <span className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">
                              {q.question}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Reply Buttons - Always show after bot messages */}
                <div className="mt-4 flex flex-wrap gap-2 pl-10">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.value}
                      onClick={() => handleQuickReply(reply.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-primary/30 text-primary rounded-full hover:bg-primary hover:text-white transition-colors shadow-sm"
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chatbot Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm text-gray-800 placeholder:text-gray-400"
                />
                <Button
                  onClick={handleSendMessage}
                  className="rounded-full px-4"
                  style={{
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
