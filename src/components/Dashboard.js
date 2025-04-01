{/* Agent Information */}
<Box sx={{ mt: 4 }}>
  <Typography variant="h5" gutterBottom>
    Available Agents
  </Typography>
  
  <Accordion defaultExpanded>
    <AccordionSummary
      expandIcon={<ExpandMore />}
      aria-controls="agent-info-content"
      id="agent-info-header"
    >
      <Typography variant="h6">Agent Capabilities</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          OM Assistant
        </Typography>
        <Typography variant="body1" paragraph>
          The general-purpose assistant for answering questions, writing content, and helping with research tasks.
        </Typography>
        
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Appetite Agent
        </Typography>
        <Typography variant="body1" paragraph>
          Specialized in food-related queries, recipes, and nutrition information.
        </Typography>
      </Box>
    </AccordionDetails>
  </Accordion>
  
  <Accordion sx={{ mt: 2 }}>
    <AccordionSummary
      expandIcon={<ExpandMore />}
      aria-controls="help-content"
      id="help-header"
    >
      <Typography variant="h6">Help</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body1" gutterBottom>
        How to use the chat:
      </Typography>
      
      <Box component="div" sx={{ ml: 2 }}>
        <ul>
          <li>Select the appropriate agent from the toggle at the top of the chat</li>
          <li>Type your message in the input field</li>
          <li>Press enter or click the send button</li>
          <li>Wait for the agent to respond</li>
        </ul>
      </Box>
      
      <Typography variant="body1" gutterBottom>
        Tips for better results:
      </Typography>
      
      <Box component="div" sx={{ ml: 2 }}>
        <ul>
          <li>Be specific in your queries</li>
          <li>Use the OM Assistant for general questions</li>
          <li>Use the Appetite Agent for food-related queries</li>
        </ul>
      </Box>
    </AccordionDetails>
  </Accordion>
</Box> 