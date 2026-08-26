# newsletter-agent

## Problem Statement

- Reading a newsletter email is a time consuming task. 
- Platforms like `Substack` makes it easier to subscribe to news letters. 
- This results in flooding of inbox with all the newsletters.
- When so many newsletters arrive on a single day, it becomes impossible to even skim them, let alone reading and understanding them.
- Hence it becomes a necessity to automate the knowledge extraction process from newsletters and make it easily understandable to user

## Solution

Read the newsletter and present it in an easy-to-consume format
- Provide missing pre-requisite content if the content is totally new to the user
	- This works based on the already available knowledge on user
- Provide easy to understand content
- Ask questions to make the content stick to user
- Update the knowledge learnt by the user so that future learnings on this topic could build on top of what is already available.

### Roadmap

- v0 - CloudRun deployment
	- Simple agent with one or two tools usage
- v1 - Generic Summarization of NewsLetter
    - Basic gemini integration
    - Define input for agent
    - Define how an agent is invoked
    - Setup e2e flow
- v2 - MCQ question list creation (backend)
    - Assumptions 
	    - Course creation can be done later
	    - The content of course can any ways be read from the newsletter content itself
    - Knowledge model 
	    - Concepts to be decided here for every mcq question
- v3 - MCQ question list creation (rendering)
    - Rendering should be as simple as possible
    - Do not complicate this
- v4 - Feedback Loop
	- User answers are the feedback from user here
	- Update knowledge model - based on answers to mcq
- v5 - Tailored Summarization
    - Make use of knowledge model
    - Summarize based on knowledge model
	    - Explain unknown concepts more than known concepts
- v6 - Pre-requisites section to "Summary" (if time permits)
- v7 - Course Creation (if time permits)
- v8 - Misconception Distractions for wrong options in the MCQ (if time permits)