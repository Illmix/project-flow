import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../context.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  employee: Employee;
  token: Scalars['String']['output'];
};

export type CreateSkillInput = {
  Name: Scalars['String']['input'];
};

export type Employee = {
  __typename?: 'Employee';
  Email: Scalars['String']['output'];
  Name: Scalars['String']['output'];
  Position?: Maybe<Scalars['String']['output']>;
  capacity_hours_per_week: Scalars['Int']['output'];
  created_at: Scalars['DateTime']['output'];
  publicId: Scalars['String']['output'];
  skills?: Maybe<Array<Skill>>;
};

export type LoginInput = {
  Email: Scalars['String']['input'];
  Password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createSkill: Skill;
  deleteMe?: Maybe<Employee>;
  login: AuthPayload;
  signup: AuthPayload;
  updateEmployee?: Maybe<Employee>;
};


export type MutationCreateSkillArgs = {
  input: CreateSkillInput;
};


export type MutationLoginArgs = {
  input?: InputMaybe<LoginInput>;
};


export type MutationSignupArgs = {
  input?: InputMaybe<SignUpInput>;
};


export type MutationUpdateEmployeeArgs = {
  input: UpdateEmployeeInput;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  getEmployee?: Maybe<Employee>;
  getEmployees?: Maybe<Array<Maybe<Employee>>>;
  getSkill?: Maybe<Skill>;
  getSkills: Array<Skill>;
  me?: Maybe<Employee>;
};


export type QueryGetEmployeeArgs = {
  publicId: Scalars['String']['input'];
};


export type QueryGetSkillArgs = {
  id: Scalars['Int']['input'];
};

export type SignUpInput = {
  Email: Scalars['String']['input'];
  Name: Scalars['String']['input'];
  Password: Scalars['String']['input'];
};

export type Skill = {
  __typename?: 'Skill';
  Name: Scalars['String']['output'];
  employees?: Maybe<Array<Employee>>;
  id: Scalars['Int']['output'];
};

export type UpdateEmployeeInput = {
  Email?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Position?: InputMaybe<Scalars['String']['input']>;
  skillIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type UpdateSkillInput = {
  Name?: InputMaybe<Scalars['String']['input']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateSkillInput: CreateSkillInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Employee: ResolverTypeWrapper<Employee>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SignUpInput: SignUpInput;
  Skill: ResolverTypeWrapper<Skill>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateEmployeeInput: UpdateEmployeeInput;
  UpdateSkillInput: UpdateSkillInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  CreateSkillInput: CreateSkillInput;
  DateTime: Scalars['DateTime']['output'];
  Employee: Employee;
  Int: Scalars['Int']['output'];
  LoginInput: LoginInput;
  Mutation: {};
  Query: {};
  SignUpInput: SignUpInput;
  Skill: Skill;
  String: Scalars['String']['output'];
  UpdateEmployeeInput: UpdateEmployeeInput;
  UpdateSkillInput: UpdateSkillInput;
}>;

export type AuthPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  employee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EmployeeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Employee'] = ResolversParentTypes['Employee']> = ResolversObject<{
  Email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Position?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  capacity_hours_per_week?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  publicId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skills?: Resolver<Maybe<Array<ResolversTypes['Skill']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createSkill?: Resolver<ResolversTypes['Skill'], ParentType, ContextType, RequireFields<MutationCreateSkillArgs, 'input'>>;
  deleteMe?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, Partial<MutationLoginArgs>>;
  signup?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, Partial<MutationSignupArgs>>;
  updateEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<MutationUpdateEmployeeArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryGetEmployeeArgs, 'publicId'>>;
  getEmployees?: Resolver<Maybe<Array<Maybe<ResolversTypes['Employee']>>>, ParentType, ContextType>;
  getSkill?: Resolver<Maybe<ResolversTypes['Skill']>, ParentType, ContextType, RequireFields<QueryGetSkillArgs, 'id'>>;
  getSkills?: Resolver<Array<ResolversTypes['Skill']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType>;
}>;

export type SkillResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Skill'] = ResolversParentTypes['Skill']> = ResolversObject<{
  Name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employees?: Resolver<Maybe<Array<ResolversTypes['Employee']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Employee?: EmployeeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Skill?: SkillResolvers<ContextType>;
}>;

