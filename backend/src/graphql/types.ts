import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Task as PrismaTask } from '@prisma/client';
import { Context } from '../context.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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

export type CreateProjectInput = {
  Description?: InputMaybe<Scalars['String']['input']>;
  Name: Scalars['String']['input'];
};

export type CreateSkillInput = {
  Name: Scalars['String']['input'];
};

export type CreateTaskInput = {
  Description?: InputMaybe<Scalars['String']['input']>;
  Name: Scalars['String']['input'];
  blockedByTaskPublicIds?: InputMaybe<Array<Scalars['String']['input']>>;
  projectPublicId: Scalars['String']['input'];
  requiredSkillIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  time_estimate_hours?: InputMaybe<Scalars['Int']['input']>;
};

export type Employee = {
  __typename?: 'Employee';
  Email: Scalars['String']['output'];
  Name: Scalars['String']['output'];
  Position?: Maybe<Scalars['String']['output']>;
  assignedTasks?: Maybe<Array<Task>>;
  capacity_hours_per_week?: Maybe<Scalars['Int']['output']>;
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
  addDependency: Task;
  assignTask: Task;
  createProject: Project;
  createSkill: Skill;
  createTask: Task;
  deleteMe?: Maybe<Employee>;
  deleteProject: Project;
  deleteTask: Task;
  login: AuthPayload;
  removeDependency: Task;
  signup: AuthPayload;
  updateEmployee?: Maybe<Employee>;
  updateProject: Project;
  updateTask: Task;
};


export type MutationAddDependencyArgs = {
  blockedTaskPublicId: Scalars['String']['input'];
  blockingTaskPublicId: Scalars['String']['input'];
};


export type MutationAssignTaskArgs = {
  employeePublicId?: InputMaybe<Scalars['String']['input']>;
  taskPublicId: Scalars['String']['input'];
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateSkillArgs = {
  input: CreateSkillInput;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationDeleteProjectArgs = {
  publicId: Scalars['String']['input'];
};


export type MutationDeleteTaskArgs = {
  publicId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input?: InputMaybe<LoginInput>;
};


export type MutationRemoveDependencyArgs = {
  blockedTaskPublicId: Scalars['String']['input'];
  blockingTaskPublicId: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  input?: InputMaybe<SignUpInput>;
};


export type MutationUpdateEmployeeArgs = {
  input: UpdateEmployeeInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
  publicId: Scalars['String']['input'];
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
  publicId: Scalars['String']['input'];
};

export type Project = {
  __typename?: 'Project';
  Description?: Maybe<Scalars['String']['output']>;
  Name: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  publicId: Scalars['String']['output'];
  tasks?: Maybe<Array<Task>>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  getEmployee?: Maybe<Employee>;
  getEmployees?: Maybe<Array<Maybe<Employee>>>;
  getProject?: Maybe<Project>;
  getProjects: Array<Project>;
  getSkill?: Maybe<Skill>;
  getSkills: Array<Skill>;
  getTask?: Maybe<Task>;
  getTasksForProject: Array<Task>;
  me?: Maybe<Employee>;
};


export type QueryGetEmployeeArgs = {
  publicId: Scalars['String']['input'];
};


export type QueryGetProjectArgs = {
  publicId: Scalars['String']['input'];
};


export type QueryGetSkillArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetTaskArgs = {
  publicId: Scalars['String']['input'];
};


export type QueryGetTasksForProjectArgs = {
  projectPublicId: Scalars['String']['input'];
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

export type Task = {
  __typename?: 'Task';
  Description?: Maybe<Scalars['String']['output']>;
  Name: Scalars['String']['output'];
  Status: TaskStatus;
  assignee?: Maybe<Employee>;
  blockedBy?: Maybe<Array<Task>>;
  blocking?: Maybe<Array<Task>>;
  created_at: Scalars['DateTime']['output'];
  project: Project;
  publicId: Scalars['String']['output'];
  requiredSkills?: Maybe<Array<Skill>>;
  time_estimate_hours?: Maybe<Scalars['Int']['output']>;
};

export enum TaskStatus {
  Canceled = 'canceled',
  Done = 'done',
  InProgress = 'in_progress',
  New = 'new'
}

export type UpdateEmployeeInput = {
  Email?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Position?: InputMaybe<Scalars['String']['input']>;
  skillIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type UpdateProjectInput = {
  Description?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSkillInput = {
  Name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTaskInput = {
  Description?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Status?: InputMaybe<TaskStatus>;
  requiredSkillIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  time_estimate_hours?: InputMaybe<Scalars['Int']['input']>;
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
  AuthPayload: ResolverTypeWrapper<Omit<AuthPayload, 'employee'> & { employee: ResolversTypes['Employee'] }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateProjectInput: CreateProjectInput;
  CreateSkillInput: CreateSkillInput;
  CreateTaskInput: CreateTaskInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Employee: ResolverTypeWrapper<Omit<Employee, 'assignedTasks' | 'skills'> & { assignedTasks?: Maybe<Array<ResolversTypes['Task']>>, skills?: Maybe<Array<ResolversTypes['Skill']>> }>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Project: ResolverTypeWrapper<Omit<Project, 'tasks'> & { tasks?: Maybe<Array<ResolversTypes['Task']>> }>;
  Query: ResolverTypeWrapper<{}>;
  SignUpInput: SignUpInput;
  Skill: ResolverTypeWrapper<Omit<Skill, 'employees'> & { employees?: Maybe<Array<ResolversTypes['Employee']>> }>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Task: ResolverTypeWrapper<PrismaTask>;
  TaskStatus: TaskStatus;
  UpdateEmployeeInput: UpdateEmployeeInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateSkillInput: UpdateSkillInput;
  UpdateTaskInput: UpdateTaskInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthPayload: Omit<AuthPayload, 'employee'> & { employee: ResolversParentTypes['Employee'] };
  Boolean: Scalars['Boolean']['output'];
  CreateProjectInput: CreateProjectInput;
  CreateSkillInput: CreateSkillInput;
  CreateTaskInput: CreateTaskInput;
  DateTime: Scalars['DateTime']['output'];
  Employee: Omit<Employee, 'assignedTasks' | 'skills'> & { assignedTasks?: Maybe<Array<ResolversParentTypes['Task']>>, skills?: Maybe<Array<ResolversParentTypes['Skill']>> };
  Int: Scalars['Int']['output'];
  LoginInput: LoginInput;
  Mutation: {};
  Project: Omit<Project, 'tasks'> & { tasks?: Maybe<Array<ResolversParentTypes['Task']>> };
  Query: {};
  SignUpInput: SignUpInput;
  Skill: Omit<Skill, 'employees'> & { employees?: Maybe<Array<ResolversParentTypes['Employee']>> };
  String: Scalars['String']['output'];
  Task: PrismaTask;
  UpdateEmployeeInput: UpdateEmployeeInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateSkillInput: UpdateSkillInput;
  UpdateTaskInput: UpdateTaskInput;
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
  assignedTasks?: Resolver<Maybe<Array<ResolversTypes['Task']>>, ParentType, ContextType>;
  capacity_hours_per_week?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  publicId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skills?: Resolver<Maybe<Array<ResolversTypes['Skill']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addDependency?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationAddDependencyArgs, 'blockedTaskPublicId' | 'blockingTaskPublicId'>>;
  assignTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationAssignTaskArgs, 'taskPublicId'>>;
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'input'>>;
  createSkill?: Resolver<ResolversTypes['Skill'], ParentType, ContextType, RequireFields<MutationCreateSkillArgs, 'input'>>;
  createTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationCreateTaskArgs, 'input'>>;
  deleteMe?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType>;
  deleteProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'publicId'>>;
  deleteTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationDeleteTaskArgs, 'publicId'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, Partial<MutationLoginArgs>>;
  removeDependency?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationRemoveDependencyArgs, 'blockedTaskPublicId' | 'blockingTaskPublicId'>>;
  signup?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, Partial<MutationSignupArgs>>;
  updateEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<MutationUpdateEmployeeArgs, 'input'>>;
  updateProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'input' | 'publicId'>>;
  updateTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'input' | 'publicId'>>;
}>;

export type ProjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = ResolversObject<{
  Description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  publicId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tasks?: Resolver<Maybe<Array<ResolversTypes['Task']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryGetEmployeeArgs, 'publicId'>>;
  getEmployees?: Resolver<Maybe<Array<Maybe<ResolversTypes['Employee']>>>, ParentType, ContextType>;
  getProject?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryGetProjectArgs, 'publicId'>>;
  getProjects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  getSkill?: Resolver<Maybe<ResolversTypes['Skill']>, ParentType, ContextType, RequireFields<QueryGetSkillArgs, 'id'>>;
  getSkills?: Resolver<Array<ResolversTypes['Skill']>, ParentType, ContextType>;
  getTask?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryGetTaskArgs, 'publicId'>>;
  getTasksForProject?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryGetTasksForProjectArgs, 'projectPublicId'>>;
  me?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType>;
}>;

export type SkillResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Skill'] = ResolversParentTypes['Skill']> = ResolversObject<{
  Name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employees?: Resolver<Maybe<Array<ResolversTypes['Employee']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = ResolversObject<{
  Description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>;
  assignee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType>;
  blockedBy?: Resolver<Maybe<Array<ResolversTypes['Task']>>, ParentType, ContextType>;
  blocking?: Resolver<Maybe<Array<ResolversTypes['Task']>>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  publicId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requiredSkills?: Resolver<Maybe<Array<ResolversTypes['Skill']>>, ParentType, ContextType>;
  time_estimate_hours?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Employee?: EmployeeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Skill?: SkillResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
}>;

