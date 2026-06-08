import { GitUser } from './github/GitUser';
import { colors, getRandomUnusedColor } from '../theme/theme';
import { customDate, genID } from '../common/database/constants';
import { DataSources, Providers, Roles, Types } from '../types/types';
import { capWords, countPropertiesInObject, isValid } from '../common/scripts/globals';

export const minRole = (currRole: Roles | string, role: Roles | string) => {
  let indexOfRole = Object.values(Roles).indexOf(currRole as Roles);
  let indexOfMinRole = Object.values(Roles).indexOf(role as Roles);
  let userIsMinRole: boolean = indexOfRole >= indexOfMinRole;
  return userIsMinRole;
}

const providerFromID = (providerID?: string) => {
  const provider = String(providerID || ``).toLowerCase();
  if (provider.includes(`google`)) return Providers.Google;
  return Providers.Firebase;
}

export class User {
  [key: string]: any;

  id!: string | number | any;
  uid!: string;
  name!: string;
  uuid!: string;
  email!: string;
  color?: any;
  title?: string;
  password?: string;
  number: number = 1;
  properties?: number;
  description?: string = ``;
  type: Types | string = Types.User;
  updated: Date | string | any = customDate()?.datetime;
  created: Date | string | any = customDate()?.datetime;

  github?: GitUser | any;
  phone?: string;
  imageURL?: string = ``;
  image?: string;
  avatar?: string;
  z_token?: string;
  boardID: string = ``;
  boardIDs: string[] = [];
  userIDs?: string[] = [];
  active?: boolean = true;
  source?: string = ``;
  verified?: boolean = true;
  roles?: Array<Roles | string> = [];
  signedIn?: boolean = false;
  anonymous?: boolean = false;
  data?: any = {};
  photoURL?: string = ``;
  metadata?: any = {};
  providerId?: string = ``;
  validSince?: string = ``;
  customerData?: any = {};
  customerID?: number | string;
  shopifyID?: number | string;
  value?: string | number;
  paymentMethods?: any[] = [];
  displayName?: string = ``;
  creationTime?: string = ``;
  lastRefresh?: string = ``;
  emailVerified?: boolean;
  lastUpdated?: Date | string | any;
  lastSignInTime?: string = ``;
  lastRefreshAt?: string = ``;
  shopifyCustomerID?: number | string;
  z_token_robinhood?: string = ``;
  role: Roles | string = Roles.Customer;
  z_token_robinhood_socket?: string = ``;
  provider: Providers | string = Providers.Firebase;
  lastSignIn?: Date | string | any = customDate()?.update;
  dataSource?: DataSources | string = DataSources.Firebase;
  lastAuthenticated?: Date | string | any = customDate()?.update;

  constructor(data: Partial<User> = {}) {
    const userData = data as Partial<User> & Record<string, any>;
    const authUser = userData.userCredential?.user || userData.firebaseUser || userData.user || {};
    const email = String(userData.email || authUser.email || ``).toLowerCase();
    const name = userData.name || userData.displayName || authUser.displayName || (isValid(email) ? capWords(email.split(`@`)[0]) : undefined);
    
    Object.assign(this, userData);

    if (isValid(email)) this.email = email;
    if (!isValid(this.uid) && isValid(authUser.uid)) this.uid = authUser.uid;
    if (!isValid(this.name) && isValid(name)) this.name = name;
    if (!isValid(this.displayName) && isValid(this.name)) this.displayName = this.name;
    if (isValid(this.displayName) && !isValid(this.name)) this.name = String(this.displayName);
    if (!isValid(this.providerId) && isValid(authUser.providerId)) this.providerId = authUser.providerId;
    if (isValid(this.providerId) && !isValid(userData.provider)) this.provider = providerFromID(this.providerId);
    if (!isValid(this.source)) this.source = String(this.provider || this.dataSource || Providers.Firebase);
    if (!isValid(userData.emailVerified) && authUser.emailVerified !== undefined) this.emailVerified = authUser.emailVerified;
    if (userData.emailVerified !== undefined) this.verified = userData.emailVerified;
    if (this.emailVerified == undefined) this.emailVerified = this.verified;
    if (!isValid(this.metadata) && isValid(authUser.metadata)) this.metadata = authUser.metadata;
    if (!isValid(this.photoURL) && isValid(authUser.photoURL)) this.photoURL = authUser.photoURL;
    if (!isValid(this.avatar) && isValid(this.photoURL)) this.avatar = this.photoURL;
    if (!isValid(this.imageURL) && isValid(userData.imageUrl)) this.imageURL = String(userData.imageUrl);
    if (!isValid(this.imageURL) && isValid(this.avatar)) this.imageURL = this.avatar;
    if (!isValid(this.imageURL) && isValid(this.image)) this.imageURL = this.image;
    if (!isValid(this.avatar) && isValid(this.imageURL)) this.avatar = this.imageURL;
    if (!isValid(this.image) && isValid(this.avatar)) this.image = this.avatar;
    if (!isValid(this.image) && isValid(this.imageURL)) this.image = this.imageURL;
    if (!isValid(this.roles) && isValid(this.role)) this.roles = [this.role];
    const firstRole = this.roles?.[0];
    if (isValid(firstRole) && !isValid(userData.role)) this.role = String(firstRole);
    if (isValid(this.customerData?.id) && !isValid(this.shopifyID)) this.shopifyID = this.customerData.id;
    if (isValid(this.shopifyID) && !isValid(this.shopifyCustomerID)) this.shopifyCustomerID = this.shopifyID;
    if (isValid(this.shopifyCustomerID) && !isValid(this.customerID)) this.customerID = this.shopifyCustomerID;
    if (isValid(this.metadata?.creationTime) && !isValid(this.creationTime)) this.creationTime = this.metadata.creationTime;
    if (isValid(this.metadata?.lastSignInTime) && !isValid(this.lastSignInTime)) this.lastSignInTime = this.metadata.lastSignInTime;
    if (isValid(this.lastSignInTime) && !isValid(userData.lastSignIn)) this.lastSignIn = this.lastSignInTime;
    if (!isValid(this.lastUpdated)) this.lastUpdated = this.updated;
    if (isValid(this.email) && !isValid(this.name)) this.name = capWords(this.email.split(`@`)[0]);

    delete this.auth;
    delete this.password;
    delete this.passwordHash;
    delete this.firebaseUser;
    delete this.userCredential;
    delete this.reloadUserInfo;
    delete this.passwordUpdatedAt;

    let ID = genID(this.type, this.number, this.name);
    let { id, title, uuid } = ID;
    if (!isValid(this.id)) this.id = id;
    if (!isValid(this.uuid)) this.uuid = uuid;
    if (!isValid(this.title)) this.title = title;
    if (!isValid(this.properties)) this.properties = countPropertiesInObject(this) + 1;

    const userColors = Object.values(colors).filter(c => c.name !== colors.info.name);
    if (!isValid(this.color) || this.color?.name === colors.info.name) {
      this.color = getRandomUnusedColor(userColors);
    }
  }
}
