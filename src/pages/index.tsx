// src/pages/Home.tsx

import React from "react";
import useSWR from 'swr';
import axios from 'axios';
import Main from "@/layout/mainLayout";
import { Container, Typography, Paper, Divider, Avatar } from '@mui/material';
import { styled, ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { red, blueGrey } from '@mui/material/colors'; // Importing MUI colors

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface Desc {
  title: string;
  content: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  bio: string;
  desc: Desc[];
}

const shadows = [
  'none',
  '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
  '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
  '0 2px 5px 0 rgba(0, 0, 0, 0.1)',
  '0 1px 10px 0 rgba(0, 0, 0, 0.1)',
  '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
  '0 3px 5px -1px rgba(0, 0, 0, 0.1)',
  '0 3px 10px 0 rgba(0, 0, 0, 0.1)',
  '0 4px 5px -2px rgba(0, 0, 0, 0.1)',
  '0 5px 5px -3px rgba(0, 0, 0, 0.1)',
  '0 5px 6px -3px rgba(0, 0, 0, 0.1)',
  '0 6px 6px -3px rgba(0, 0, 0, 0.1)',
  '0 6px 7px -4px rgba(0, 0, 0, 0.1)',
  '0 7px 8px -4px rgba(0, 0, 0, 0.1)',
  '0 7px 8px -4px rgba(0, 0, 0, 0.1)',
  '0 7px 9px -4px rgba(0, 0, 0, 0.1)',
  '0 8px 9px -5px rgba(0, 0, 0, 0.1)',
  '0 8px 10px -5px rgba(0, 0, 0, 0.1)',
  '0 8px 11px -5px rgba(0, 0, 0, 0.1)',
  '0 9px 11px -5px rgba(0, 0, 0, 0.1)',
  '0 9px 12px -6px rgba(0, 0, 0, 0.1)',
  '0 10px 13px -6px rgba(0, 0, 0, 0.1)',
  '0 10px 13px -6px rgba(0, 0, 0, 0.1)',
];

const theme = createTheme({
  palette: {
    primary: {
      main: blueGrey[500],
    },
    secondary: {
      main: red[500],
    },
    background: {
      default: '#1F2937',
      paper: '#374151',
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#D1D5DB',
    },
  },
  shape: {
    borderRadius: 8,
  },
  
  spacing: 8,
});

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1], // Corrected usage of theme.shadows
  color: theme.palette.text.primary,
  marginTop: theme.spacing(4),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginBottom: theme.spacing(2),
}));

const StyledName = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledEmail = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white, // Changed to white color
}));

const StyledBio = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
}));

const StyledDescriptionCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(4),
}));

const StyledDescriptionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const StyledDescriptionContent = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const Home: React.FC = () => {
  const { data, error } = useSWR<User>('/api/user', fetcher);

  if (error) return <div>Error loading user data</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={theme}>
      <Main>
        <StyledContainer>
          <div className="text-center mb-8">
            <StyledAvatar alt={data.name} src="/path/to/avatar.jpg" />
            <StyledName variant="h3" gutterBottom>{data.name}</StyledName>
            <StyledEmail variant="h6" gutterBottom>{data.email}</StyledEmail>
            <StyledBio variant="body1" gutterBottom>{data.bio}</StyledBio>
          </div>
          <Divider />
          <StyledSectionTitle variant="h6" gutterBottom>Descriptions</StyledSectionTitle>
          {data.desc.map((desc, index) => (
            <StyledDescriptionCard key={index}>
              <StyledDescriptionTitle variant="h6" gutterBottom>{desc.title}</StyledDescriptionTitle>
              <StyledDescriptionContent variant="body2" gutterBottom>{desc.content}</StyledDescriptionContent>
            </StyledDescriptionCard>
          ))}
        </StyledContainer>
      </Main>
    </ThemeProvider>
  );
};

export default Home;
