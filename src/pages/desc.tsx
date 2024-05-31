"use client";

import React from 'react';
import { Container, Typography, TextField, Button, IconButton, Grid, Paper } from '@material-ui/core';
import { Formik, Form, Field, FieldArray } from 'formik';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import Main from '@/layout/mainLayout';
import DeleteIcon from '@material-ui/icons/Delete';
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

const ProfilePage: React.FC = () => {
  const classes = useStyles();
  const { data, error } = useSWR<User>('/api/user', fetcher);

  if (error) return <div>Error loading user data</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Main>
      <Container className='w-full md:w-1/2 justify-start mt-8'>
        <Typography variant="h4" className={`${classes.title} mb-4`}>Descriptions</Typography>
        <Formik
          initialValues={{ descs: data.desc }}
          onSubmit={(values, actions) => {
            axios.put('/api/user', { ...data, desc: values.descs })
              .then(res => {
                mutate('/api/user', { ...data, desc: values.descs }, false);
                console.log('Description updated successfully');
              })
              .catch(err => {
                console.error('Error updating descs:', err);
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <FieldArray name="descs">
                {({ push, remove }) => (
                  <div>
                    {values.descs.length === 0 && (
                      <Typography variant="body1" className={classes.noDescription}>No descriptions available.</Typography>
                    )}
                    {values.descs.map((desc, index) => (
                      <Paper key={index} className={classes.descContainer}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={5}>
                            <Field
                              name={`descs.${index}.title`}
                              as={TextField}
                              label="Title"
                              fullWidth
                              InputProps={{ className: classes.inputText }}
                              InputLabelProps={{ className: classes.inputLabel }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Field
                              name={`descs.${index}.content`}
                              as={TextField}
                              label="Content"
                              fullWidth
                              InputProps={{ className: classes.inputText }}
                              InputLabelProps={{ className: classes.inputLabel }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <IconButton onClick={() => remove(index)} aria-label="delete" className={classes.deleteButton}>
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => push({ title: '', content: '' })}
                      className={`${classes.addButton} mt-4`}
                    >
                      Add Description
                    </Button>
                  </div>
                )}
              </FieldArray>
              <div className="mt-8">
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </Main>
  );
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: '#3B82F6', // Primary blue color
  },
  noDescription: {
    color: '#D1D5DB', // Light gray color
  },
  descContainer: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#1F2937', // Dark blue-gray background
    color: '#F3F4F6', // Light gray text
  },
  inputText: {
    color: 'white',
  },
  inputLabel: {
    color: 'darkgray',
  },
  deleteButton: {
    color: '#EF4444', // Red color for delete button
  },
  addButton: {
    backgroundColor: '#3B82F6',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2563EB',
    },
  },
}));

export default ProfilePage;
