import React from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, Avatar } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import Main from '@/layout/mainLayout';
import { makeStyles } from '@material-ui/core/styles';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

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
    backgroundColor: '#3B82F6', // Primary blue color
  },
  name: {
    color: '#3B82F6', // Primary blue color
    marginBottom: theme.spacing(2),
  },
  email: {
    color: '#9CA3AF', // Gray color
    marginBottom: theme.spacing(2),
  },
  bio: {
    color: '#D1D5DB', // Light gray color
    marginBottom: theme.spacing(4),
  },
  formField: {
    '& .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiInputLabel-root': {
      color: 'darkgray',
    },
    marginBottom: theme.spacing(2),
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2563EB',
    },
  },
}));

const ProfilePage: React.FC = () => {
  const classes = useStyles();
  const { data, error } = useSWR('/api/user', fetcher);

  if (error) return <div>Error loading user data</div>;
  if (!data) return <div>Loading...</div>;

  const { id, name, email, bio, desc } = data;

  return (
    <Main>
      <Container className='w-full md:w-1/2 mt-8'>
        <Paper className={classes.profileContainer}>
          <Grid container direction="column" alignItems="center">
            <Avatar alt={name} src="/path/to/avatar.jpg" className={classes.avatar} />
            <Typography variant="h4" className={classes.name}>{name}</Typography>
            <Typography variant="h6" className={classes.email}>{email}</Typography>
            <Typography variant="body1" className={classes.bio}>{bio}</Typography>
          </Grid>
          <Formik
            initialValues={{ id, name, email, bio, desc }}
            onSubmit={(values, actions) => {
              axios.put('/api/user', values)
                .then(res => {
                  mutate('/api/user', values, false);
                  console.log('Profile updated successfully');
                })
                .catch(err => {
                  console.error('Error updating profile:', err);
                })
                .finally(() => {
                  actions.setSubmitting(false);
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      name="name"
                      as={TextField}
                      label="Name"
                      fullWidth
                      className={classes.formField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="email"
                      as={TextField}
                      label="Email"
                      fullWidth
                      className={classes.formField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="bio"
                      as={TextField}
                      multiline
                      rows={3}
                      label="Bio"
                      fullWidth
                      className={classes.formField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      className={classes.saveButton}
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Main>
  );
}

export default ProfilePage;
