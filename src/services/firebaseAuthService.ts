import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface User {
  id: string; // Firebase UID
  _id?: string; // MongoDB ID
  fullName: string;
  email: string;
  role?: string; // Ajouter le rôle optionnel
}

export class FirebaseAuthService {
  static async register(fullName: string, email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, {
        displayName: fullName
      });

      return {
        id: firebaseUser.uid,
        fullName: fullName,
        email: firebaseUser.email!
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Erreur lors de la création du compte.');
    }
  }

  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      return {
        id: firebaseUser.uid,
        fullName: firebaseUser.displayName || 'User',
        email: firebaseUser.email!
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Erreur de connexion. Vérifiez vos identifiants.');
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Erreur lors de la déconnexion.');
    }
  }

  static async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      return {
        id: firebaseUser.uid,
        fullName: firebaseUser.displayName || 'User',
        email: firebaseUser.email!
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Erreur de connexion avec Google.');
    }
  }

  static async loginWithFacebook(): Promise<User> {
    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      return {
        id: firebaseUser.uid,
        fullName: firebaseUser.displayName || 'User',
        email: firebaseUser.email!
      };
    } catch (error) {
      console.error('Facebook login error:', error);
      throw new Error('Erreur de connexion avec Facebook.');
    }
  }

  static convertFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      fullName: firebaseUser.displayName || 'User',
      email: firebaseUser.email!
    };
  }

  static async changePassword(currentPassword, newPassword) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Aucun utilisateur n'est connecté.");
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      // Ré-authentifier l'utilisateur
      await reauthenticateWithCredential(user, credential);
      // Mettre à jour le mot de passe
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      // Gérer les erreurs communes
      if (error.code === 'auth/wrong-password') {
        throw new Error("Le mot de passe actuel est incorrect.");
      }
      throw new Error("Une erreur est survenue lors du changement de mot de passe.");
    }
  }
}
