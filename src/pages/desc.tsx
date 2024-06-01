// src/pages/ProfilePage.tsx
import React from 'react';
import { Container, Typography, TextField, Button, IconButton, Grid, Paper } from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import Main from '@/layout/mainLayout';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';

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
  const { data, error } = useSWR<User>('/api/user', fetcher);

  if (error) return <div>Error loading user data</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Main>
      <Container className='w-full md:w-1/2 justify-start mt-8'>
        <StyledTypography variant="h4" className="mb-4 text-white">Descriptions</StyledTypography>
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
                      <StyledTypography variant="body1" className="text-white">No descriptions available.</StyledTypography>
                    )}
                    {values.descs.map((desc, index) => (
                      <StyledPaper key={index} className="mb-4 p-4 rounded-lg shadow-lg">
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={5}>
                            <Field
                              name={`descs.${index}.title`}
                              as={TextField}
                              label="Title"
                              fullWidth
                              InputProps={{ className: 'inputText text-white' }}
                              InputLabelProps={{ className: 'inputLabel text-white' }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Field
                              name={`descs.${index}.content`}
                              as={TextField}
                              label="Content"
                              fullWidth
                              InputProps={{ className: 'inputText text-white' }}
                              InputLabelProps={{ className: 'inputLabel text-white' }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <IconButton onClick={() => remove(index)} aria-label="delete" className="deleteButton">
                              <DeleteIcon style={{ color: '#EF4444' }} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </StyledPaper>
                    ))}
                    <Button
                      onClick={() => push({ title: '', content: '' })}
                      variant="contained"
                      color="primary"
                      className="mt-4"
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

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: '#3B82F6', // Primary blue color
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4),
  backgroundColor: '#1F2937', // Dark blue-gray background
  color: '#FFFFFF', // White text
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
    '& .MuiInputLabel-root': {
      color: '#FFFFFF !important', // Ensure label is white
    },
    '& .MuiInputBase-root': {
      color: '#FFFFFF', // Ensure input text is white
    },
  },
}));

export default ProfilePage;
