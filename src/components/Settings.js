import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Slider, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Paper 
} from '@mui/material';

const Settings = () => {
  const [model, setModel] = useState('GPT-4');
  const [temperature, setTemperature] = useState(0.7);
  const [tools, setTools] = useState(['Web Search', 'Document Analysis']);
  
  const handleToolChange = (event) => {
    const value = event.target.value;
    if (tools.includes(value)) {
      setTools(tools.filter(t => t !== value));
    } else {
      setTools([...tools, value]);
    }
  };
  
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Agent Settings
      </Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel id="model-select-label">AI Model</InputLabel>
        <Select
          labelId="model-select-label"
          id="model-select"
          value={model}
          label="AI Model"
          onChange={(e) => setModel(e.target.value)}
        >
          <MenuItem value="GPT-4">GPT-4</MenuItem>
          <MenuItem value="Claude 3 Opus">Claude 3 Opus</MenuItem>
          <MenuItem value="Gemini Pro">Gemini Pro</MenuItem>
          <MenuItem value="Custom LLM">Custom LLM</MenuItem>
        </Select>
      </FormControl>
      
      <Box sx={{ mt: 3 }}>
        <Typography id="temperature-slider" gutterBottom>
          Temperature: {temperature}
        </Typography>
        <Slider
          aria-labelledby="temperature-slider"
          value={temperature}
          onChange={(e, newValue) => setTemperature(newValue)}
          step={0.1}
          marks
          min={0}
          max={1}
          valueLabelDisplay="auto"
        />
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography gutterBottom>
          Available Tools
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox 
                checked={tools.includes('Web Search')}
                onChange={() => handleToolChange({ target: { value: 'Web Search' } })}
              />
            }
            label="Web Search"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={tools.includes('Document Analysis')}
                onChange={() => handleToolChange({ target: { value: 'Document Analysis' } })}
              />
            }
            label="Document Analysis"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={tools.includes('Code Generation')}
                onChange={() => handleToolChange({ target: { value: 'Code Generation' } })}
              />
            }
            label="Code Generation"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={tools.includes('Data Visualization')}
                onChange={() => handleToolChange({ target: { value: 'Data Visualization' } })}
              />
            }
            label="Data Visualization"
          />
        </FormGroup>
      </Box>
    </Paper>
  );
};

export default Settings; 