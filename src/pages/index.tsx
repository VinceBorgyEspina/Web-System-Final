import React from "react";
import useSWR from 'swr';
import axios from 'axios';
import Main from "@/layout/mainLayout";
import { Container, Typography, Paper, Divider, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles((theme) => ({
  profileContainer: {
    backgroundColor: '#1F2937', // Dark blue-gray background
    padding: theme.spacing(8),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    color: '#F3F4F6', // Light gray text
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(2),
  },
  name: {
    color: '#3B82F6', // Primary blue color
  },
  email: {
    color: '#9CA3AF', // Gray color
  },
  bio: {
    color: '#D1D5DB', // Light gray color
  },
  sectionTitle: {
    color: '#3B82F6',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  descriptionCard: {
    backgroundColor: '#374151', // Gray color
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    marginBottom: theme.spacing(4),
  },
  descriptionTitle: {
    color: '#F3F4F6',
  },
  descriptionContent: {
    color: '#D1D5DB',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const { data, error } = useSWR<User>('/api/user', fetcher);

  if (error) return <div>Error loading user data</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Main>
      <Container className={classes.profileContainer}>
        <div className="text-center mb-8">
          <Avatar alt={data.name} src="/path/to/avatar.jpg" className={classes.avatar} />
          <Typography variant="h3" gutterBottom className={classes.name}>{data.name}</Typography>
          <Typography variant="h6" gutterBottom className={classes.email}>{data.email}</Typography>
          <Typography variant="body1" gutterBottom className={classes.bio}>{data.bio}</Typography>
        </div>
        <Divider />
        <Typography variant="h6" gutterBottom className={classes.sectionTitle}>Descriptions</Typography>
        {data.desc.map((desc, index) => (
          <Paper key={index} className={classes.descriptionCard}>
            <Typography variant="h6" gutterBottom className={classes.descriptionTitle}>{desc.title}</Typography>
            <Typography variant="body2" gutterBottom className={classes.descriptionContent}>{desc.content}</Typography>
          </Paper>
        ))}
      </Container>
    </Main>
  );
};

export default Home;
