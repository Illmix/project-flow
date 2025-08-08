/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
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
