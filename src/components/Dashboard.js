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
          Market Agent
        </Typography>
        <Typography variant="body1" paragraph>
          Specialized in market research, analysis, and business intelligence.
        </Typography>
        
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Vault Agent
        </Typography>
        <Typography variant="body1" paragraph>
          Specialized in handling sensitive information with enhanced security protocols.
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
          <li>Use the Market Agent for market research and analysis</li>
          <li>Use the Vault Agent for secure and sensitive communications</li>
        </ul>
      </Box>
    </AccordionDetails>
  </Accordion>
</Box> 