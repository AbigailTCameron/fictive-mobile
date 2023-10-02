import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { useEffect, useState } from 'react';
import LoadingPage from './screens/loading/LoadingPage';
import { auth } from './functions';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchUserDetails } from './components/queries/fetchUserDetails';
import ReadScreen from './screens/ReadScreen';
import UserScreen from './screens/UserScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReadingListScreen from './screens/ReadingListScreen';
import FollowingScreen from './screens/FollowingScreen';
import PublishedScreen from './screens/PublishedScreen';
import CreateScreen from './screens/CreateScreen';
import DraftScreen from './screens/DraftScreen';
import SpecificDraftScreen from './screens/SpecificDraftScreen';
import EditDraftScreen from './screens/EditDraftScreen';
import NewDraftChapterScreen from './screens/NewDraftChapterScreen';
import SinglePublishedScreen from './screens/SinglePublishedScreen';
import NewPublishedChapterScreen from './screens/NewPublishedChapterScreen';
import EditPublishedScreen from './screens/EditPublishedScreen';
import TrendingScreen from './screens/TrendingScreen';
import SettingsScreen from './screens/SettingsScreen';
import NewAccountScreen from './screens/NewAccountScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null); 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      setLoading(true);
      try{
        setUser(user);

        if(user) {
          const userDetailsData = await fetchUserDetails(user);
          setUserDetails(userDetailsData);
        }

      }catch(error){
        console.log("Error when trying to fetch user details:", error);
      }finally {  
          setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <LoadingPage />
    );
  }


  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {props => <HomeScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="SignUp">
            {props => <NewAccountScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="Book">
            {props => <ReadScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="Trending">
            {props => <TrendingScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="Settings">
            {props => <SettingsScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="User" >
            {props => <UserScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen >

          <Stack.Screen name="Profile">
            {props => <ProfileScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="Reading List">
            {props => <ReadingListScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="Following">
            {props => <FollowingScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="Published">
            {props => <PublishedScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="Create">
            {props => <CreateScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="Drafts">
            {props => <DraftScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="SpecificDraft">
            {props => <SpecificDraftScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>
          
          <Stack.Screen name="EditDraft">
            {props => <EditDraftScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="NewDraftChapter">
            {props => <NewDraftChapterScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>
          
          <Stack.Screen name="SpecificPublished">
            {props => <SinglePublishedScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="NewPublishedChapter">
            {props => <NewPublishedChapterScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

          <Stack.Screen name="EditPublished">
            {props => <EditPublishedScreen user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>}
          </Stack.Screen>

         </Stack.Navigator>
    </NavigationContainer>
   
  );

}
