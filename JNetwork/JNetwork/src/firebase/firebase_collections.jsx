import { collection } from 'firebase/firestore';
import { db } from './init_firebase';

// ref to user collection
const usersCollectionRef = collection(db, 'users');
const questionsCollectionRef = collection(db, 'questions');
const responsesCollectionRef = collection(db, 'responses');
const matchCollectionRef = collection(db, 'match');
const communityPostsCollectionRef = collection(db, 'communityPosts')

export { usersCollectionRef, questionsCollectionRef, responsesCollectionRef, matchCollectionRef, communityPostsCollectionRef };