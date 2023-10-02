import { arrayRemove, arrayUnion, collection, doc, addDoc, deleteDoc, 
  onSnapshot, serverTimestamp, getDoc, getDocs, limit, orderBy, query, 
  updateDoc, setDoc, where, or } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, EmailAuthProvider, deleteUser, reauthenticateWithCredential, sendPasswordResetEmail, updateEmail, updatePassword } from "firebase/auth";
import { db, auth, logout, storage } from "../../functions";


export const fetchUserDetails = async (currentUser) => {
  try {
    const userDocRef = doc(db, 'users', currentUser.uid); 
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userDetailsData = userSnapshot.data();
      return userDetailsData;
    }else{
      console.log("User document does not exist in firestore.");
      return null;
    }
    
  } catch(error){
    console.error("Error fetching user details", error);
  } 
}

export const fetchBooks = async (setLoading, setBooks, batchSize, setHasMoreBooks) => {
  try{
    setLoading(true);
    const booksCollectionRef = collection(db, 'books');
    let queryRef = query(booksCollectionRef, orderBy('createdAt', 'desc'), limit(batchSize)); 

    const querySnapshot = await getDocs(queryRef); 
    const booksData = querySnapshot.docs.map((doc) => doc); 

    const resolvedBooksData = await Promise.all(booksData);

    // Check if there are more books to load
    if (resolvedBooksData.length < batchSize) {
      setHasMoreBooks(false); // No more books to load
    } else {
      setHasMoreBooks(true); // There are more books to load
    }

    setBooks(resolvedBooksData)

  }catch (error){
    console.error("Error fetching books:", error);
  } finally {
    setLoading(false);
  }
}


export const performSearch = async (searchQuery, setSearchResults) => {
  try {
    const booksCollectionRef = collection(db, "books");
    const usersCollectionRef = collection(db, "users");

    // Convert the search query to lowercase or uppercase
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    // Generate an array with all possible case variations of the search query
    const caseVariations = [
      searchQuery,
      lowerCaseSearchQuery,                 // lowercase
      lowerCaseSearchQuery.toUpperCase(),   // UPPERCASE
      lowerCaseSearchQuery.replace(/^\w/, c => c.toUpperCase()) // Title Case
    ];

    // Additional case variations: Capitalize the first character of each word
    const words = lowerCaseSearchQuery.split(" ");
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const firstLetterUpper = capitalizedWords.join(" ");
    caseVariations.push(firstLetterUpper);

    // Search for books with a title or author that matches the search query
    const booksQuery = query(booksCollectionRef, or(
      where("bookTitle", "in", caseVariations),
      where("author", "in", caseVariations),
      where("tags", "array-contains", searchQuery)
    ));
    const booksSnapshot = await getDocs(booksQuery);

    // Search for users with a username, first name, or last name that matches the search query
    const usersQuery = query(usersCollectionRef, or(
      where("username", "in", caseVariations),
      where("firstName", "in", caseVariations),
      where("lastName", "in", caseVariations)
    ))
    const usersSnapshot = await getDocs(usersQuery);

    // Process the books results and add the collectionType property
    const booksResults = booksSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      collectionType: "books",
    }));

    // Process the users results and add the collectionType property
    const usersResults = usersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      collectionType: "users",
    }));

    // Combine the search results for books and users
    const combinedResults = [...booksResults, ...usersResults];

    // Update the searchResults state with the combined search results
    setSearchResults(combinedResults);

  }catch(error) {
    console.error("Error performing search:", error);
  }

}


export const signInExplore = async(setPasswordError, email, setEmailError, password) => {
  try{
    const usersCollectionRef = collection(db, 'users');
    const emailQuery = query(usersCollectionRef, where('email', '==', email));
    const emailSnapshot = await getDocs(emailQuery);

    if (emailSnapshot.empty) {
      setEmailError(true);
      console.log('Email does not exist');
      return;
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in successfully');
  
  }catch (error){
    console.error('Error logging in:', error); 
    setPasswordError(true); 
  }

}


export const fetchBook = async (setLoading, bookId, setBookData) => {
  try{
    setLoading(true);
  
    const bookDocRef = doc(db, 'books', bookId);
    const bookSnapshot = await getDoc(bookDocRef);

    if (bookSnapshot.exists()) {
      const bookData = bookSnapshot.data();

      // Fetch chapters subcollection for the book
      const chaptersCollectionRef = collection(bookDocRef, 'chapters');
      const chaptersQuery = query(chaptersCollectionRef, orderBy('timestamp'));

      const chaptersSnapshot = await getDocs(chaptersQuery);
      const chaptersData = chaptersSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; 
      });

      bookData.chapters = chaptersData; 
      setBookData(bookData);

    } else {
      console.error('Book not found');
    }

  }catch (error){
    console.error("Error fetching book info:", error);
  } finally {
    setLoading(false);
  }
}

export const fetchUserById = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId); 
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userDetailsData = userSnapshot.data();
      return userDetailsData;
    }else{
      console.log("User document does not exist in firestore.");
      return null;
    }
    
  } catch(error){
    console.error("Error fetching user details", error);
  } 
}


export const fetchComments = async (setLoading, bookId, chapterId, setComments, batchSize, setHasMoreComments) => {
  try {
    setLoading(true); 
    if(chapterId !== null && bookId !== null) {
          const commentsRef = collection(
            doc(collection(db, 'comments'), bookId),
            'chapters',
            chapterId,
            'comments'
          );

          // Query for only the first batch of comments initially
          const initialQuery = query(commentsRef, orderBy('timestamp', 'desc'), limit(batchSize));

          const unsubscribe = onSnapshot(
            initialQuery,
            async (snapshot) => {
              const commentsData = snapshot.docs.map(async(doc) =>  {
                const data = doc.data();
                const user = await fetchUserById(data.userId); 
                return {
                  id: doc.id,
                  content: data.content,
                  userId: data.userId,
                  timestamp: data.timestamp,
                  user: user
                };
              });

              const resolvedCommentsData = await Promise.all(commentsData);

              // Check if there are more comments to load
              if (resolvedCommentsData.length < batchSize) {
                setHasMoreComments(false); // No more comments to load
              } else {
                setHasMoreComments(true); // There are more comments to load
              }

              setComments(resolvedCommentsData);
            }
          );

          return () => unsubscribe();  
    }

  }catch (error){
    console.log("Error fetching comments:", error);
  }finally {
    setLoading(false); 
  }
}

export const handlePostComment = async (comment, bookId, chapterId, userId, setComment) => {
  try {
    // Check if the comment is not empty before posting
    if (comment.trim() === '') {
      return;
    }

    const commentsRef = collection(
      doc(collection(db, 'comments'), bookId),
      'chapters',
      chapterId,
      'comments'
    );
    
    await addDoc(commentsRef, {
      userId,
      content: comment,
      timestamp: serverTimestamp(),
    });

    setComment('');

  }catch(error) {
    console.error('Error posting comment:', error);
  }

}


export const fetchReplies = async (bookId, chapterId, commentId, setReplies, replyBatchSize, setHasMoreReplies) => {
  const repliesRef = collection(
    doc(collection(db, 'comments'), bookId),
    'chapters',
    chapterId, 
    'comments',
    commentId,
    'replies'
  );

  // Query for only the first batch of comments initially
  const initialQuery = query(repliesRef, orderBy('timestamp'), limit(replyBatchSize));

  const unsubscribe = onSnapshot(
    initialQuery,
    async(snapshot) => {
      const repliesData = snapshot.docs.map(async(doc) => {
        const data = doc.data();
        const user = await fetchUserById(data.userId);

        return {
          id: doc.id,
          content: data.content, 
          userId: data.userId, 
          timestamp: data.timestamp,
          user: user
        }
      })

      const resolvedCommentsData = await Promise.all(repliesData);

      // Check if there are more comments to load
      if (resolvedCommentsData.length < replyBatchSize) {
        setHasMoreReplies(false); // No more comments to load
      } else {
        setHasMoreReplies(true); // There are more comments to load
      }

      setReplies(resolvedCommentsData);

    }
  );

  return () => unsubscribe();
}


export const deleteComment = async(bookId, chapterId, commentId) => {
  try {

    const repliesDocRef = doc(db, 'comments', bookId, 'chapters', chapterId, 'comments', commentId);
    const repliesCollectionRef = collection(repliesDocRef, 'replies');

    const repliesSnapshot = await getDocs(repliesCollectionRef);

    if(!repliesSnapshot.empty){
      const deleteRepliesPromises = repliesSnapshot.docs.map(async (replyDoc) => {
        await deleteDoc(replyDoc.ref);
      });

      await Promise.all(deleteRepliesPromises)
    }

    await deleteDoc(repliesDocRef);

    console.log('Comment is successfully deleted!')


  }catch(error){
    console.log("Error deleting the comment:", error); 
  }
}

export const deleteReply = async (bookId, chapterId, commentId, repliesId) => {
  try {
    // Create a reference to the collections
    const repliesDocRef = doc(db, 'comments', bookId, 'chapters', chapterId, 'comments', commentId, 'replies', repliesId);
    await deleteDoc(repliesDocRef);

    console.log("Reply successfully deleted!")

  }catch(error){
    console.log("Error trying to delete a reply:", error);
  }
}


export const updateRating = async(bookId, rating, userId) => {
  try{
    const bookRef = doc(db, 'books', bookId); 
    const bookDoc = await getDoc(bookRef); 

    const userRatingRef = collection(bookRef, 'userRatings'); 
    const userRatingDocRef = doc(userRatingRef, userId);

    const userRatingDoc = await getDoc(userRatingDocRef); 

    const userRef = doc(db, 'books', bookId, 'userRatings', userId); 

    const currentTotalRatings = bookDoc.data().totalRatings; 
    const currentRating = bookDoc.data().rating; 
    
    if(userRatingDoc.exists()) {

      const previousRating = userRatingDoc.data().rating;
      const newRating = ((currentRating * currentTotalRatings - previousRating) + rating) / currentTotalRatings;

      await updateDoc(bookRef, {
        rating: newRating,
      });

      await updateDoc(userRef, {
        rating: rating,
      });
    }else{
      const newTotalRatings = currentTotalRatings + 1;
      const newRating = ((currentRating * currentTotalRatings) + rating) / newTotalRatings;

      await updateDoc(bookRef, {
        totalRatings: newTotalRatings,
        rating: newRating
      })

      await setDoc(userRatingDocRef, {
        rating: rating,
      });
    }

  }catch(error){
    console.log("Error grabbing rating information:", error);
  }
}


export const handleToggleReadingList = async (user, bookId, setReadingList, userDetails, setUserDetails) => {
  try {
    if (!user) {
      console.error('User not logged in.');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const list = userDocSnapshot.data().readingList || [];

    if (list.includes(bookId)) {
      // Remove the book from the reading list
      await setDoc(userDocRef, { readingList: arrayRemove(bookId) }, { merge: true });
      console.log('Book removed from reading list successfully!');
    } else {
      // Add the book to the reading list
      await setDoc(userDocRef, { readingList: arrayUnion(bookId) }, { merge: true });
      console.log('Book added to reading list successfully!');
    }

    // Update the readingList state in the ExploreContent component
    setReadingList((prevReadingList) =>
      list.includes(bookId)
        ? prevReadingList.filter((id) => id !== bookId)
        : [...prevReadingList, bookId]
    );

    // Update the userDetails to reflect changes in the context
    const updatedUserDetails = { ...userDetails };
    updatedUserDetails.readingList = list.includes(bookId)
      ? updatedUserDetails.readingList.filter((id) => id !== bookId)
      : [...updatedUserDetails.readingList, bookId];
    setUserDetails(updatedUserDetails); // Assuming you have a setUserDetails function from the AuthContext
    
  } catch (error) {
    console.error('Error toggling reading list:', error);
  }
};

export const fetchUserData = async (setLoading, username, setUserData) => {
  try {
    setLoading(true);

    const usersCollectionRef = collection(db, 'users');
    const userQuery = query(usersCollectionRef, where('username', '==', username));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.docs.length > 0) {
      // Assuming the username is unique, there should be only one document in the snapshot
      setUserData(userSnapshot.docs[0].data());
    }

  }catch(error){
    console.error('Error fetching user data:', error);
  }finally {
    setLoading(false); 
  }
}


export const fetchFollowingProfiles = async (setLoading, list, setFollowingList) => {
  try{
    setLoading(true);

    if(!list || list.length === 0){
      setFollowingList([]);
      return;
    }

    const usersCollectionRef = collection(db, "users");

    // Query users whose usernames are in the "following" list
    const followingQuery = query(usersCollectionRef, where("username", "in", list)); 
    const followingSnapshot = await getDocs(followingQuery); 

    const followingProfiles = followingSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        profilePictureURL: data.profilePictureURL,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        published: data.published,
      };
    });

    // Sort the followingProfiles array by the lastName field in ascending order
    followingProfiles.sort((a, b) => {
      const lastNameA = a.lastName ? a.lastName.toLowerCase() : "";
      const lastNameB = b.lastName ? b.lastName.toLowerCase() : "";
      return lastNameA.localeCompare(lastNameB);
    });

    setFollowingList(followingProfiles);

  }catch (error){
    console.log("Error fetching following list", error); 
  }finally {
    setLoading(false); 
  }
}


export const handleToggleFollowList= async (setFollowing, userDetails, setUserDetails, username) => {
  try {
   
    const userDocRef = doc(db, 'users', userDetails.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const list = userDocSnapshot.data().following || [];

    if (list.includes(username)) {
      // Remove the person from follow list
      await setDoc(userDocRef, { following: arrayRemove(username) }, { merge: true });
      console.log('Person removed from follow list successfully!');
    } else {
      // Add person to follow list
      await setDoc(userDocRef, { following: arrayUnion(username) }, { merge: true });
      console.log('Person added to follow list successfully!');
    }

    // Update the following state 
    setFollowing((prevFollowList) =>
      list.includes(username)
        ? prevFollowList.filter((id) => id !== username)
        : [...prevFollowList, username]
    );

    // Update the userDetails to reflect changes in the context
    const updatedUserDetails = { ...userDetails };
    updatedUserDetails.following = list.includes(username)
      ? updatedUserDetails.following.filter((id) => id !== username)
      : [...updatedUserDetails.following, username];
    setUserDetails(updatedUserDetails); // Assuming you have a setUserDetails function from the AuthContext
    
  } catch (error) {
    console.error('Error toggling reading list:', error);
  }
};


export const fetchPublished = async (setLoading, userDetails, setBooks) => {
  try{
    setLoading(true); 
    if(userDetails?.published){
      // Fetch book data for each item in the reading list array
      const readingListData = await Promise.all(
        userDetails.published.map(async(bookId) => {
          const bookDocRef = doc(db, 'books', bookId); 
          const bookSnapShot = await getDoc(bookDocRef);
          return bookSnapShot;
        })
      ) 
      setBooks(readingListData);
    }
  
  }catch (error){
    console.log("Error fetching reading list", error); 
  }finally {
    setLoading(false); 
  }
}


export const handleBookClick = async (bookId, navigation) => {
  try {

    const bookDocRef = doc(db, 'books', bookId, bookTitle, image, userDetails);
    const bookSnapshot = await getDoc(bookDocRef);

    if (bookSnapshot.exists()) {

      const bookData = bookSnapshot.data();
      const readCount = bookData.readCount || 0; // Initialize read count if it doesn't exist

   
      // Update the chapter content in Firestore
      await updateDoc(bookDocRef, { readCount: readCount + 1 });

      navigation.navigate("Book", {
        bookId,
        bookTitle,
        image,
        userDetails
      });
    }

  }catch (error) {
    console.error('Error updating chapter content:', error);
  }
}


export const handleLogout = async (navigation) => {
  await logout();
  navigation.navigate("Home")
};


export const fetchReadingList = async (setLoading, userDetails, setReadingList) => {
  try{
    setLoading(true);
    if(userDetails.readingList){
      // Fetch book data for each item in the reading list array
      const readingListData = await Promise.all(
        userDetails.readingList.map(async(bookId) => {
          const bookDocRef = doc(db, 'books', bookId); 
          const bookSnapShot = await getDoc(bookDocRef);
          return bookSnapShot;
        })
      )
      setReadingList(readingListData);
    }

  }catch (error){
    console.log("Error fetching reading list", error); 
  }finally {
    setLoading(false); 
  }
}


export const saveAsDraft = async (imageFile, currentUser, chapterTitle, storyContent, bookTitle, navigation) => {
  try {
      // Upload the image to Firebase Storage (if an image is selected)
      let imageUrl = ''; // Initialize the image URL  

      const response = await fetch(imageFile);
      const blob = await response.blob();
  
      const timestamp = Date.now();

      if (imageFile) {
        const storageRef = ref(storage, `draft_images/${currentUser.uid}/${timestamp}`);
        const snapshot = await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const draftsCollectionRef = collection(db, 'users', currentUser.uid, 'drafts');

      const newChapter = {
        chapterTitle: chapterTitle,
        content: storyContent,
        timestamp: serverTimestamp(),
      }

      // Add the chapter to the "chapters" subcollection of the draft
      const newDraftRef = await addDoc(draftsCollectionRef, {
        bookTitle: bookTitle,
        userId: currentUser.uid,
        image_url: imageUrl, // Store the image URL in the database
        createdAt: serverTimestamp(),
        tags: [],
        synopsis: ""
      });

      // Get the generated ID of the new draft and use it to create a chapter document
      const chaptersCollectionRef = collection(draftsCollectionRef, newDraftRef.id, 'chapters');
      const chapterRef = doc(chaptersCollectionRef, newDraftRef.id); // Use the same generated ID
      await setDoc(chapterRef, newChapter);

   
      navigation.navigate('Drafts'); 

  }catch (error){
      console.error('Error saving draft:', error); 
  }
}


export const fetchDrafts = async (user, setDraftData, setLoading) => {
  try{
    setLoading(true);

    // Fetch the draft collection for the currently logged in user
    const draftsCollectionRef = collection(db, 'users', user.uid, 'drafts'); 
    const draftSnapshot = await getDocs(draftsCollectionRef);

    // array to store drafts and the chapters
    const draftsData = []; 

    // Loop through each draft document
    for(const docSnapshot of draftSnapshot.docs) {
      const draftData = docSnapshot.data(); 
      const draftId = docSnapshot.id; 

      // Fetch the chapters subcollection for the current draft document
      const chaptersCollectionRef = collection(db, 'users', user.uid, 'drafts', draftId, 'chapters'); 
      const chaptersQuery = query(chaptersCollectionRef, orderBy('timestamp'));
      const chaptersSnapshot = await getDocs(chaptersQuery);

      // Create an array to store the chapters data for the current draft
      const chaptersData = [];

      // Loop through each chapter document 
      for(const chapterSnapshot of chaptersSnapshot.docs){
        const chapterData = chapterSnapshot.data(); 
        chaptersData.push({
          id: chapterSnapshot.id, // Add unique ID as the key
          ...chapterData
        }); 
      }

      // Add chapters data to the draftData object
      draftData.chapters = chaptersData;

      // Add the draftData object to the draftsData array
      draftsData.push({
        id: draftId, 
        ...draftData
      });
    }
    //return draftsData;

    setDraftData(draftsData);

  }catch(error){
    console.error('Error fetching draft data:', error);
  }finally {
    setLoading(false); 
  }
}


export const fetchPublishedDraft = async(setLoading, userId, draftId, setDraftData) => {
  try{
    setLoading(true);

    const draftDocRef = doc(db, 'users', userId, 'drafts', draftId);
    const draftSnapshot = await getDoc(draftDocRef);

    if (draftSnapshot.exists()) {
      const draftData = draftSnapshot.data();

      // Fetch chapters subcollection for the book
      const chaptersCollectionRef = collection(draftDocRef, 'chapters');
      const chaptersQuery = query(chaptersCollectionRef, orderBy('timestamp'));

      const chaptersSnapshot = await getDocs(chaptersQuery);
      const chaptersData = chaptersSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      draftData.chapters = chaptersData;

      setDraftData(draftData)

    }else{
      console.error('Draft not found');
    }
  }catch(error){
    console.error('Error fetching draft info:', error);
  }finally{
    setLoading(false);
  }
}


export const handleSaveTitle = async (userId, draftId, newTitle, draft) => {
  try {
    // Update the book title in Firestore
    const userDocRef = doc(db, 'users', userId, 'drafts', draftId);
    await updateDoc(userDocRef, { bookTitle: newTitle });

    // Update the draftsData with the new image_url
    const updatedDraftsData = { ...draft, bookTitle: newTitle };
    return updatedDraftsData;

  }catch (error) {
    console.error('Error updating book title:', error);
  }

}


export const handleSaveTags = async (userDetails, draftId, tag) => {
  try {
    // Create a reference to the draft document in the drafts collection
    const draftDocRef = doc(db, 'users', userDetails.uid, 'drafts', draftId);

    const userDraftSnapshot = await getDoc(draftDocRef);
    const tagList = userDraftSnapshot.data().tags || [];

    tag = tag.toLowerCase();
    
    if (tagList.includes(tag)) {
      // Remove the book from the reading list
      await setDoc(draftDocRef, { tags: arrayRemove(tag) }, { merge: true });
      console.log('Tag removed from tag list successfully!');
    } else {
      // Add the book to the reading list
      await setDoc(draftDocRef, { tags: arrayUnion(tag) }, { merge: true });
      console.log('Book added to reading list successfully!');
    }

  } catch (error) {
    console.error('Error saving tags:', error);
  }
};


export const handleSaveSynopsis = async(userDetails, draftId, synopsisInput, setSynopsisInput, setEditPost) => {
  try {
    const draftDocRef = doc(db, 'users', userDetails.uid, 'drafts', draftId);

    await updateDoc(draftDocRef, { synopsis: synopsisInput });
 
    setSynopsisInput(synopsisInput);
 
    console.log('Synopsis saved successfully!');

    setEditPost(false);


  }catch (error) {
    console.error('Error saving synopsis:', error);
  }
}


export const handleDeleteDraft = async (userDetails, draftId, navigation) => {
  try {
    // Create a reference to the draft document in the drafts collection
    const draftDocRef = doc(db, 'users', userDetails.uid, 'drafts', draftId);

    // Get a reference to the chapters subcollection 
    const chaptersCollectionRef = collection(draftDocRef, 'chapters'); 

    // Get all the documents in the chapters subcollection
    const chaptersSnapshot = await getDocs(chaptersCollectionRef); 


    const deleteChapterPromises = chaptersSnapshot.docs.map(async (chapterDoc) => {
      const chapterId = chapterDoc.id;
      const chapterDocRef = doc(db, 'users', userDetails.uid, 'drafts', draftId, 'chapters', chapterId); 
      await deleteDoc(chapterDocRef)
    })

    // Wait for all chapter documents to be deleted
    await Promise.all(deleteChapterPromises);
    
    // Delete the draft document
    await deleteDoc(draftDocRef);

    console.log('Draft deleted successfully!');

    navigation.navigate('Drafts'); 

  } catch (error) {
    console.error('Error deleting draft:', error);
  }
};


export const handlePublish = async (userDetails, draftId, navigation) => {
  try {
    // Create a reference to the original draft document in the "Drafts" collection
    const draftDocRef = doc(db, 'users', userDetails.uid, 'drafts', draftId);

    // Get the original draft data from the "Drafts" collection
    const draftSnapshot = await getDoc(draftDocRef);
    const draftData = draftSnapshot.data();

    // Create a new document in the "Books" collection
    const booksCollectionRef = collection(db, 'books');
    const newBookDocRef = await addDoc(booksCollectionRef, {
      ...draftData,
      publishedAt: serverTimestamp(),
      publishedBy: userDetails.uid,
      author: `${userDetails.firstName} ${userDetails.lastName}`,
      username: userDetails.username,
      rating: 0,
      totalRatings: 1,
      isPublished: true,
      readCount: 0
    });

    // Fetch the chapters subcollection for the draft
    const chaptersCollectionRef = collection(draftDocRef, 'chapters');
    const chaptersSnapshot = await getDocs(chaptersCollectionRef);
    const chaptersData = chaptersSnapshot.docs.map((doc) => doc.data());

    // Create a new chapters subcollection in the new book document
    const newChaptersCollectionRef = collection(newBookDocRef, 'chapters');
    for (const chapter of chaptersData) {
      await addDoc(newChaptersCollectionRef, chapter);
    }

    // Create a new subcollection 'userRatings' in the new book document
    const userRatingsCollectionRef = collection(newBookDocRef, 'userRatings');

    // Add a document with userId as the document ID and 'rating' field
    await setDoc(doc(userRatingsCollectionRef, userDetails.uid), {
      rating: 0,
    });

    // Get the ID of the new book document
    const newBookId = newBookDocRef.id;

    // Update the published list inside the currently signed-in user's document
    const userDocRef = doc(db, 'users', userDetails.uid);
    await updateDoc(userDocRef, {
      published: arrayUnion(newBookId),
    });

    const deleteChapterPromises = chaptersSnapshot.docs.map(async (chapterDoc) => {
      const chapterId = chapterDoc.id;
      const chapterDocRef = doc(db, 'users', userDetails.uid, 'drafts', draftId, 'chapters', chapterId); 
      await deleteDoc(chapterDocRef)
    })

    // Wait for all chapter documents to be deleted
    await Promise.all(deleteChapterPromises);
  
    // Delete the original draft document from the "Drafts" collection
    await deleteDoc(draftDocRef);

    navigation.navigate("Published");

  }catch (error) {
      console.error('Error publishing draft:', error);
  }
}


export const returnFetchPublishedDraft = async(setLoading, userId, draftId, setDraftData) => {
  try{
    setLoading(true);

    const draftDocRef = doc(db, 'users', userId, 'drafts', draftId);
    const draftSnapshot = await getDoc(draftDocRef);

    if (draftSnapshot.exists()) {
      const draftData = draftSnapshot.data();

      // Fetch chapters subcollection for the book
      const chaptersCollectionRef = collection(draftDocRef, 'chapters');
      const chaptersQuery = query(chaptersCollectionRef, orderBy('timestamp'));

      const chaptersSnapshot = await getDocs(chaptersQuery);
      const chaptersData = chaptersSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      draftData.chapters = chaptersData;

      setDraftData(draftData);
      return draftData;

    }else{
      console.error('Draft not found');
    }
  }catch(error){
    console.error('Error fetching draft info:', error);
  }
}


export const fetchDraft = async(setLoading, userId, draftId, setDraftData, setDraftInfo, chapterId) => {
  try{
    setLoading(true);

    const draftData = await returnFetchPublishedDraft(setLoading, userId, draftId, setDraftData);

    if(draftData != null) {
      const specificDraft = draftData.chapters.find((chapter) => chapter.id === chapterId);
      setDraftInfo(specificDraft);
    }
    
  }catch(error){
    console.error('Error fetching draft chapter:', error);
  }finally{
    setLoading(false);
  }
}


export const handleSaveChapterContent = async (userId, draftId, chapterId, chapterTitle, newChapterContent, navigation) => {
  try {
    // Update the chapter content in Firestore
    const chapterDocRef = doc(db, 'users', userId, 'drafts', draftId, 'chapters', chapterId);
    await updateDoc(chapterDocRef, {
      chapterTitle: chapterTitle,
      content: newChapterContent 
    });

    navigation.navigate("SpecificDraft", {
      draftId
    })

  }catch (error) {
    console.error('Error updating chapter content:', error);
  }
}


export const deleteChapter = async (userId, draftId, chapterId, navigation) => {
  try {
    // Create a reference to the chapter document in the chapters subcollection
    const chapterDocRef = doc(db, 'users', userId, 'drafts', draftId, 'chapters', chapterId);

    // Delete the chapter document
    await deleteDoc(chapterDocRef);

    console.log('Chapter deleted successfully!');

    navigation.navigate("SpecificDraft", {
      draftId
    }); 

  } catch (error) {
    console.error('Error deleting chapter:', error);
  }
};


export const handleAddNewChapter = async (chapterTitle, storyContent, userId, draftId, navigation) => {
  try {
    // Create a new chapter object with initial data and timestamp
    const newChapter = {
      chapterTitle: chapterTitle,
      content: storyContent,
      timestamp: serverTimestamp(), // Add timestamp field with current time in milliseconds
    };

    // Add the new chapter to the Firestore "chapters" subcollection
    const chaptersCollectionRef = collection(db, 'users', userId, 'drafts', draftId, 'chapters');
    await addDoc(chaptersCollectionRef, newChapter);

    navigation.navigate("SpecificDraft", {draftId});

    console.log('New chapter added successfully!');
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
};


export const fetchPublishedBook = async(setLoading, bookId, setBookData) => {
  try {
    setLoading(true);
    const bookDocRef = doc(db, 'books', bookId);
    const bookSnapshot = await getDoc(bookDocRef);

    if (bookSnapshot.exists()) {
      const bookData = bookSnapshot.data();

      // Fetch chapters subcollection for the book
      const chaptersCollectionRef = collection(bookDocRef, 'chapters');
      const chaptersQuery = query(chaptersCollectionRef, orderBy('timestamp'));

      const chaptersSnapshot = await getDocs(chaptersQuery);
      const chaptersData = chaptersSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      bookData.chapters = chaptersData;

      // Fetch drafts subcollection for the book
      const draftsCollectionRef = collection(bookDocRef, 'drafts');
      const draftsQuery = query(draftsCollectionRef, orderBy('timestamp'));

      const draftsSnapshot = await getDocs(draftsQuery);
      const draftsData = draftsSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      bookData.drafts = draftsData;

      setBookData(bookData);
    } else {
      console.error('Book not found');
    }
  } catch (error) {
    console.error('Error fetching book info:', error);
  } finally {
    setLoading(false);
  }
}


export const removeFromReadingList = async (bookId) => {

  const usersCollectionRef = collection(db, 'users');
  const usersQuery = query(usersCollectionRef, where('readingList', 'array-contains', bookId));

  try {
    const querySnapshot = await getDocs(usersQuery);

    const updateUserPromises = querySnapshot.docs.map(async (userDoc) => {
      const userId = userDoc.id;
      const userDocRef = doc(db, 'users', userId);

      const updatedReadingList = userDoc.data().readingList.filter((id) => id !== bookId);

      await updateDoc(userDocRef, { readingList: updatedReadingList });
      console.log(`Removed ${bookId} from reading list of user ${userId}`);
    });

    await Promise.all(updateUserPromises);

  } catch (error) {
    console.error('Error updating user documents:', error);
  }
};


export const handleDeletePublished = async (bookId, userDetails, navigation, setUserDetails) => {
  try{
    // Create a reference to the collections
    const draftDocRef = doc(db, 'books', bookId);

    // Get a reference to the chapters, drafts, and userRatings subcollection 
    const chaptersCollectionRef = collection(draftDocRef, 'chapters'); 
    const draftsCollectionRef = collection(draftDocRef, 'drafts'); 
    const userRatingsCollectionRef = collection(draftDocRef, 'userRatings'); 

    // Get all the documents in the subcollection
    const chaptersSnapshot = await getDocs(chaptersCollectionRef);
    const draftsSnapshot = await getDocs(draftsCollectionRef);
    const ratingsSnapshot = await getDocs(userRatingsCollectionRef);
    
    if(!chaptersSnapshot.empty){
      const deleteChapterPromises = chaptersSnapshot.docs.map(async (chapterDoc) => {
        const chapterId = chapterDoc.id;
        const chapterDocRef = doc(db, 'books', bookId, 'chapters', chapterId); 
        await deleteDoc(chapterDocRef);

        const commentChaptersRef = collection(db, 'comments', bookId, 'chapters', chapterId, 'comments');
        const commentChaptersSnapshot = await getDocs(commentChaptersRef);

        commentChaptersSnapshot.forEach(async (commentChapterDoc) => {
            const commentsRef = collection(doc(commentChaptersRef, commentChapterDoc.id), 'replies');
            const commentsSnapshot = await getDocs(commentsRef);

            commentsSnapshot.forEach(async (replyDoc) => {
              await deleteDoc(replyDoc.ref);
            });

            await deleteDoc(commentChapterDoc.ref); 
        })        

      })

      await Promise.all(deleteChapterPromises);
    }
   
    if(!draftsSnapshot.empty){
      const deleteDraftPromises = draftsSnapshot.docs.map(async (chapterDoc) => {
        const chapterId = chapterDoc.id;
        const chapterDocRef = doc(db, 'books', bookId, 'drafts', chapterId); 
        await deleteDoc(chapterDocRef)
      })

      await Promise.all(deleteDraftPromises);
    }

    if(!ratingsSnapshot.empty){
      const deleteRatingPromises = ratingsSnapshot.docs.map(async (ratingDoc) => {
        const ratingId = ratingDoc.id;
        const ratingDocRef = doc(db, 'books', bookId, 'userRatings', ratingId); 
        await deleteDoc(ratingDocRef);
      })
      await Promise.all(deleteRatingPromises);
    }
    // Delete the draft document
    await deleteDoc(draftDocRef);

  
    const userDocRef = doc(db, 'users', userDetails.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const list = userDocSnapshot.data().published || [];

    if (list.includes(bookId)) {
      await setDoc(userDocRef, { published: arrayRemove(bookId) }, { merge: true });

      const updatedUserDetails = { ...userDetails, published: userDetails.published.filter(id => id !== bookId) };
      setUserDetails(updatedUserDetails);
      console.log('Book removed from reading list successfully!');
    }

    console.log('Draft deleted successfully!');

    await removeFromReadingList(bookId); 
    
    navigation.navigate("Published"); 


  }catch(error){
    console.error('Error deleting the published book:', error);
  }
}


export const handleSavePublishedTags = async(bookId, tag) => {
  try {
      // Create a reference to the draft document in the drafts collection
      const draftDocRef = doc(db, 'books', bookId);

      const bookSnapshot = await getDoc(draftDocRef);
      const tagList = bookSnapshot.data().tags || [];

      tag = tag.toLowerCase();
    
      if (tagList.includes(tag)) {
        // Remove the book from the reading list
        await setDoc(draftDocRef, { tags: arrayRemove(tag) }, { merge: true });
        console.log('Tag removed from tag list successfully!');
      } else {
        // Add the book to the reading list
        await setDoc(draftDocRef, { tags: arrayUnion(tag) }, { merge: true });
        console.log('Book added to reading list successfully!');
      }

  }catch(error){
    console.error('Error saving tags:', error); 
  }
}


export const handleSavePublishedSynopsis = async (bookId, synopsisInput, setSynopsisInput, setEditPost) => {
  try {

    const draftDocRef  = doc(db, 'books', bookId);

    await updateDoc(draftDocRef, { synopsis: synopsisInput});

    setSynopsisInput(synopsisInput); 

    console.log('Synopsis saved successfully!'); 

    setEditPost(false); 

  }catch(error) {
    console.error('Error saving synopsis:', error); 
  }
}


export const handleNewPostClick = async(bookId, chapterTitle, storyContent, navigation) => {
  try{
    
    const draftsCollectionRef = collection(db, 'books', bookId, 'drafts');

    const newChapter = {
      chapterTitle: chapterTitle,
      content: storyContent,
      timestamp: serverTimestamp(),
    }

    // Add the chapter to the "chapters" subcollection of the draft
    await addDoc(draftsCollectionRef, newChapter);

    navigation.navigate("SpecificPublished", {bookId});

  }catch(error){
    console.error('Error creating a new draft:', error);
  }
}


export const handleChapterPublish = async (chapterTitle, storyContent, bookId, navigation) => {
  try {
    // Create a new chapter object with updated title and content
    const newChapter = {
      chapterTitle: chapterTitle,
      content: storyContent,
      timestamp: serverTimestamp(),
    };

    // Create a reference to the original draft document in the "Drafts" collection
    const draftDocRef = collection(db, 'books', bookId, 'chapters');
    await addDoc(draftDocRef, newChapter);

    navigation.navigate("SpecificPublished", {bookId});

  }catch (error) {
      console.error('Error publishing draft:', error);
  }
}


export const returnFetchPublishedBook = async(setLoading, bookId, setBookData) => {
  try {
    setLoading(true);
    const bookDocRef = doc(db, 'books', bookId);
    const bookSnapshot = await getDoc(bookDocRef);

    if (bookSnapshot.exists()) {
      const bookData = bookSnapshot.data();

      // Fetch chapters subcollection for the book
      const chaptersCollectionRef = collection(bookDocRef, 'chapters');
      const chaptersQuery = query(chaptersCollectionRef, orderBy('timestamp'));

      const chaptersSnapshot = await getDocs(chaptersQuery);
      const chaptersData = chaptersSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      bookData.chapters = chaptersData;

      // Fetch drafts subcollection for the book
      const draftsCollectionRef = collection(bookDocRef, 'drafts');
      const draftsQuery = query(draftsCollectionRef, orderBy('timestamp'));

      const draftsSnapshot = await getDocs(draftsQuery);
      const draftsData = draftsSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      bookData.drafts = draftsData;

      setBookData(bookData); 
      
      return bookData;
    } else {
      console.error('Book not found');
    }
  } catch (error) {
    console.error('Error fetching book info:', error);
  } finally {
    setLoading(false);
  }
}


export const fetchBookAndDraft = async(setLoading, bookId, publishedId, setDraftInfo, setBookData) => {
  try{
    setLoading(true); 
    
    const bookData = await returnFetchPublishedBook(setLoading, bookId, setBookData); 

    if(bookData != null){
      const specificDraft = bookData.drafts.find((draft) => draft.id === publishedId);
      setDraftInfo(specificDraft);
    }

  }catch(error){
    console.error('Error fetching book data:', error);
  }finally {
    setLoading(false); 
  }
}


export const handleDeleteChapterPublished = async (bookId, draftId, navigation) => {
  try {
    // Create a reference to the chapter document in the chapters subcollection
    const draftDocRef = doc(db, 'books', bookId, 'drafts', draftId);

    await deleteDoc(draftDocRef);

    console.log('Chapter deleted successfully!');

    navigation.navigate("SpecificPublished", {bookId}); 

  }catch (error) {
    console.error('Error deleting chapter:', error);
  }
}


export const handleReEditPost = async (bookId, draftId, chapterTitle, storyContent, navigation) => {
  try {
      // Update the chapter title in Firestore
      const draftDocRef = doc(db, 'books', bookId, 'drafts', draftId);
      await updateDoc(draftDocRef, { 
      chapterTitle: chapterTitle,
      content: storyContent
      });
      // Exit edit mode
    
      navigation.navigate("SpecificPublished", {bookId})

    }catch (error) {
      console.error('Error updating chapter title:', error);
    }
}


export const handleRePublish = async (chapterTitle, storyContent, bookId,draftId, navigation) => {
  try {
    // Create a new chapter object with updated title and content
    const newChapter = {
      chapterTitle: chapterTitle,
      content: storyContent,
      timestamp: serverTimestamp(),
    };

    // Create a reference to the original draft document in the "Drafts" collection
    const draftDocRef = collection(db, 'books', bookId, 'chapters');
    await addDoc(draftDocRef, newChapter);

    
    // Delete the current draft from the "drafts" subcollection
    const docRef = doc(db, 'books', bookId, 'drafts', draftId);
    await deleteDoc(docRef);

    navigation.navigate("SpecificPublished", {bookId});

  }catch (error) {
      console.error('Error publishing draft:', error);
  }
}



export const uploadProfilePicture = async (imageFile, userId, userDetails, setUserDetails) => {
  if (!imageFile || !imageFile.assets || !imageFile.assets[0] || !imageFile.assets[0].uri) {
    console.log('Please select an image to upload.');
    return;
  }
  try {      
    // Delete the old profile picture from Firebase Storage, if it exists
    if (userDetails.profilePictureURL) {
      const storageRef = ref(storage, userDetails.profilePictureURL);
      await deleteObject(storageRef);
    }

    const response = await fetch(imageFile.assets[0].uri);
    const blob = await response.blob();

    const timestamp = Date.now();

    // Upload the image to Firebase Storage
    const storageRef = ref(storage, `profile_pictures/${userId}/${timestamp}.jpg`);
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save the download URL as the user's profile picture
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { profilePictureURL: downloadURL });
    
    // Save the download URL as the user's profile picture
    // Update your Firestore collection with the profile picture URL for the user
    // ...
    console.log('Profile picture uploaded successfully!');

    // Update the draftsData with the new image_url
    const updatedUserData = { ...userDetails, profilePictureURL: downloadURL };
    setUserDetails(updatedUserData);

  } catch (error) {
    console.error('Error uploading profile picture:', error);
  }
};


export const handleDirectPublish = async(bookTitle, chapterTitle, storyContent, imageFile, userDetails, navigation, setUserDetails) => {
  try {
    // Upload the image to Firebase Storage (if an image is selected)
    let imageUrl = ''; // Initialize the image URL  

    const response = await fetch(imageFile);
    const blob = await response.blob();

    const timestamp = Date.now();

    if (imageFile) {
      const storageRef = ref(storage, `draft_images/${userDetails.uid}/${timestamp}`);
      const snapshot = await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
  
    // Create a new document in the "Books" collection
    const booksCollectionRef = collection(db, "books");
    const newBookDocRef = await addDoc(booksCollectionRef, {
      bookTitle: bookTitle,
      publishedAt: serverTimestamp(),
      publishedBy: userDetails.uid,
      author: `${userDetails.firstName} ${userDetails.lastName}`,
      username: userDetails.username,
      userId: userDetails.uid,
      rating: 0,
      totalRatings: 1,
      isPublished: true,
      tags: [],
      synopsis: "",
      image_url: imageUrl,
      createdAt: serverTimestamp()
    });

    const newChapter = {
      chapterTitle: chapterTitle,
      content: storyContent,
      timestamp: serverTimestamp(), // Add timestamp field with current time in milliseconds
    };

    // Create a new chapters subcollection in the new book document
    const newChaptersCollectionRef = collection(newBookDocRef, 'chapters');
    await addDoc(newChaptersCollectionRef, newChapter);

   
    // Create a new subcollection 'userRatings' in the new book document
    const userRatingsCollectionRef = collection(newBookDocRef, 'userRatings');
    
    // Add a document with userId as the document ID and 'rating' field
    await setDoc(doc(userRatingsCollectionRef, userDetails.uid), {
      rating: 0,
    });

    // Get the ID of the new book document
    const newBookId = newBookDocRef.id;

    // Update the published list inside the currently signed-in user's document
    const userDocRef = doc(db, 'users', userDetails.uid);
    await updateDoc(userDocRef, {
      published: arrayUnion(newBookId),
    });

    // Call setUserDetails to update userDetails
    setUserDetails({ ...userDetails, published: [...userDetails.published, newBookId] });


    navigation.navigate("Home");


  }catch (error){
    console.log('Error publishing story:', error); 
  }
}


export const uploadBookCover = async(imageFile, draft, draftId, userId, setDraftData) => {
  try{
      if (!imageFile) {
        console.log('Please select an image to upload.');
        return;
      }

      // Delete the old profile picture from Firebase Storage, if it exists
      if(draft.image_url){
        const storageRef = ref(storage, draft.image_url);
        await deleteObject(storageRef);
      }

      const response = await fetch(imageFile.assets[0].uri);
      const blob = await response.blob();
  
      const timestamp = Date.now();

      // Upload the image to Firebase Storage
      const storageRef = ref(storage, `draft_images/${userId}/${timestamp}`);
      const snapshot = await uploadBytes(storageRef, blob);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save the download URL as this specific draft's book cover
      const userDocRef = doc(db, 'users', userId, 'drafts', draftId);
      await updateDoc(userDocRef, { image_url: downloadURL });

      console.log('Draft cover uploaded successfully!');

      // Update the draftsData with the new image_url
      const updatedDraftsData = { ...draft, image_url: downloadURL };
      setDraftData(updatedDraftsData)

  }catch (error) {
    console.error('Error uploading draft cover:', error);
  }

}



export const updatePublishedBookCover = async(imageFile, book, userId, bookId, setBookData) => {
  try{
    if (!imageFile) {
      console.log('Please select an image to upload.');
      return;
    }

    // Delete the old profile picture from Firebase Storage, if it exists
    if(book.image_url){
      const storageRef = ref(storage, book.image_url);
      await deleteObject(storageRef);
    }

    const response = await fetch(imageFile.assets[0].uri);
    const blob = await response.blob();

    const timestamp = Date.now();

    // Upload the image to Firebase Storage
    const storageRef = ref(storage, `draft_images/${userId}/${timestamp}`);
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save the download URL as this specific draft's book cover
    const bookDocRef = doc(db, 'books', bookId);
    await updateDoc(bookDocRef, { image_url: downloadURL });

    console.log('Book cover updated successfully!');

    // Update the draftsData with the new image_url
    const updatedDraftsData = { ...book, image_url: downloadURL };
    setBookData(updatedDraftsData);
    
  }catch(error) {
    console.log('Error updating published cover:', error);
  }
}


export const handlePostReply = async (reply, bookId, chapterId, commentId, userId, setReplyText) => {
  try {

    // Check if the comment is not empty before posting
    if (reply.trim() === '') {
      return;
    }

    // Reference to the comments subcollection of the current chapter
    const commentsRef = collection(
      doc(collection(db, 'comments'), bookId),
      'chapters',
      chapterId,
      'comments',
      commentId,
      'replies'
    );

    // Create a new comment document in the "comments" subcollection
    await addDoc(commentsRef, {
      userId,
      content: reply,
      timestamp: serverTimestamp(),
    });

    setReplyText('');

  } catch(error) {
    console.error('Error posting reply comment:', error)
  }
}


export const fetchTrending = async(setLoading, setTrending) => {
  try{
    setLoading(true); 

    // Assuming you have a Firestore reference named 'db'
    const booksRef = collection(db, 'books');

    let queryBooks = query(booksRef, orderBy('rating', 'desc'), orderBy('publishedAt', 'asc'), limit(9));
    const booksSnapshot = await getDocs(queryBooks);


    const bookData = booksSnapshot.docs.map((doc) => {
      return {...doc.data(), id: doc.id};
    })

    const resolvedBooksData = await Promise.all(bookData);


    setTrending(resolvedBooksData);
  
  }catch(error){
    console.log("Error fetching books trending:", error);
  }finally{
    setLoading(false);
  }

}

export const updateAccount = async (userId, firstName, lastName, bio, navigation) => {
  try {
    if(firstName != ''){
        const userDocRef = doc(db, 'users', userId); 
    
        await updateDoc(userDocRef, {
          firstName: firstName
        }); 
    }

    if(lastName != ''){
      const userDocRef = doc(db, 'users', userId); 
  
      await updateDoc(userDocRef, {
        lastName: lastName
      }); 
    }

    if(bio != ''){
      const userDocRef = doc(db, 'users', userId); 
  

      await updateDoc(userDocRef, {
        bio: bio
      }); 
    }

    navigation.navigate("Home");
    console.log('Update successful!'); 

  }catch(error) {
    console.error('Error updating names:', error); 
  }
}


export const reauthenticate = async(email, password, setEmailError, onConfirm, setEmailLoginPopup) => {
  const user = auth.currentUser;

  if(email === user.email){
    try{

      // Reauthenticate the user with their password
      const credentials = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credentials);
      onConfirm();
      setEmailLoginPopup(false);

    }catch(error){
      console.log("Error with reauthenticating", error); 
      setEmailError(true); 
    }

  }else{
    setEmailError(true); 
  }

}


export const changeEmail = async (newEmail, userId, setEmailError, setUserDetails) => {
  try {
    const user = auth.currentUser;
  
    // Check if username or email already exists
    const usersCollectionRef = collection(db, 'users');
    const emailQuery = query(usersCollectionRef, where('email', '==', newEmail));
    

    const [emailDocs] = await Promise.all([
      getDocs(emailQuery),
    ]);

    if (!emailDocs.empty) {
      // Email already exists
      setEmailError(true);
      return;
    }

    await updateEmail(user, newEmail);

    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      email: newEmail
    }); 

    setUserDetails(prevUserDetails => ({
      ...prevUserDetails,
      email: newEmail,
    }));

    console.log('Email changed successfully');
  } catch (error) {
    console.error('Error changing email:', error);
  }
};



export const changePassword = async (newPassword, setPasswordMatchError, validatePassword, navigation) => {
  try {
    if (validatePassword()) {
      const user = auth.currentUser;

      await updatePassword(user, newPassword);
      console.log('Password changed successfully');
    }else {
      // Display error or take appropriate action
      setPasswordMatchError(true);
    }

    navigation.navigate("Home");
   
  } catch (error) {
    console.error('Error changing password:', error);
  }
};


export const handleSignUp = async(validatePassword, username, email, firstName, lastName, setUsernameError, setEmailError, password, navigation, setPasswordMatchError) => {

  if (password.length < 6) {
    // Password is too short
    setPasswordMatchError('Password needs at least 6 characters');
    return;
  }

  if (validatePassword()) {
    try {
      // Check if username or email already exists
      const usersCollectionRef = collection(db, 'users');
      const usernameQuery = query(usersCollectionRef, where('username', '==', username));
      const emailQuery = query(usersCollectionRef, where('email', '==', email));

      const [usernameDocs, emailDocs] = await Promise.all([
        getDocs(usernameQuery),
        getDocs(emailQuery),
      ]);

      if (!usernameDocs.empty) {
        // Username already exists
        setUsernameError(true);
        return;
      }

      if (!emailDocs.empty) {
        // Email already exists
        setEmailError(true);
        return;
      }

      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const actionCodeSettings = {
        url: 'https://fictivelabs.com/explore', // Replace with your app's URL
        // ... (other settings)
        customParameters: {
          displayName: firstName,
          appName: 'Fictive', // Replace with your app's name
        },
      };


      // Send email verification
      await sendEmailVerification(user, actionCodeSettings);
      

      // Use the generated UID as the document ID for the new user document
      const userDocRef = doc(db, 'users', user.uid);

      // Create a new user document in the "users" collection
      await setDoc(userDocRef, {
        uid: user.uid,
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        profilePictureURL: "",
        published: [],
        readingList: [],
        following: [],
      });
     
      console.log('User signed up successfully!');
      navigation.navigate("Home");


    } catch (error) {
      console.error('Error signing up:', error);
    }

  } else {
    // Display error or take appropriate action
    setPasswordMatchError('Passwords do not match!');
  }
};
