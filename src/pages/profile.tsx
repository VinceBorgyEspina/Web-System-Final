import React from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, Avatar } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import Main from '@/layout/mainLayout';
import { styled } from '@mui/material/styles'; // Import styled from @mui/material/styles

const fetcher = (url: string) => axios.get(url).then(res => res.data);

// Define the styled components
const ProfileContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1F2937',
  padding: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  color: '#F3F4F6',
}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginBottom: theme.spacing(2),
  backgroundColor: '#3B82F6',
}));

const NameTypography = styled(Typography)(({ theme }) => ({
  color: '#3B82F6',
  marginBottom: theme.spacing(2),
}));

const EmailTypography = styled(Typography)(({ theme }) => ({
  color: '#9CA3AF',
  marginBottom: theme.spacing(2),
}));

const BioTypography = styled(Typography)(({ theme }) => ({
  color: '#D1D5DB',
  marginBottom: theme.spacing(4),
}));

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3B82F6',
  color: 'white',
  '&:hover': {
    backgroundColor: '#2563EB',
  },
}));

const ProfilePage: React.FC = () => {
  const { data, error } = useSWR('/api/user', fetcher);

  if (error) return <div>Error loading user data</div>;
  if (!data) return <div>Loading...</div>;

  const { id, name, email, bio, desc } = data;

  return (
    <Main>
      <Container className='w-full md:w-1/2 mt-8'>
        <ProfileContainer>
          <Grid container direction="column" alignItems="center">
            <AvatarStyled alt={name} src="/path/to/avatar.jpg" />
            <NameTypography variant="h4">{name}</NameTypography>
            <EmailTypography variant="h6">{email}</EmailTypography>
            <BioTypography variant="body1">{bio}</BioTypography>
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
                      InputProps={{ className: 'white', style: { color: 'white' } }} // Adjust input base color and font color
                      InputLabelProps={{ className: 'darkgray', style: { color: 'darkgray' } }} // Adjust label color
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="email"
                      as={TextField}
                      label="Email"
                      fullWidth
                      InputProps={{ className: 'white', style: { color: 'white' } }}
                      InputLabelProps={{ className: 'darkgray', style: { color: 'darkgray' } }}
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
                      InputProps={{ className: 'white', style: { color: 'white' } }}
                      InputLabelProps={{ className: 'darkgray', style: { color: 'darkgray' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SaveButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      Save
                    </SaveButton>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </ProfileContainer>
      </Container>
    </Main>
  );
}

export default ProfilePage;
