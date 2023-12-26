const App = () => {
  const courseName = "Half Stack application development";
  interface CoursePartBase {
    name: string;
    exerciseCount: number;
  }

  interface CoursePartDescription extends CoursePartBase {
    description: string;
  }
  
  interface CoursePartBasic extends CoursePartDescription {
    kind: "basic"
  }
  
  interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group"
  }
  
  interface CoursePartBackground extends CoursePartDescription {
    backgroundMaterial: string;
    kind: "background"
  }

  interface CoursePartSpecial extends CoursePartDescription {
    requirements: string[];
    kind: "special";
  }
  
  type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;
  
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const Part = ({part}: {part: CoursePart}): JSX.Element => {
    let print = null

    switch (part.kind) {
      case "basic":
        print = (<i>{part.description}</i>);
        break;
      case "group":
        print = (<>project exercises {part.groupProjectCount}</>);
        break;
      case "background":
        print = (
          <>
          <i>{part.description}</i><br/>
          background material can be found {part.backgroundMaterial}</>);
        break;
      case "special":
        print = (
          <>
          <i>{part.description}</i><br/>
          required skills: {part.requirements.join(", ")}</>);
        break;
      default:
        return assertNever(part);
    }

    return (
      <>
        <p><b>{part.name} {part.exerciseCount}</b><br />
        {print}</p>
      </>
    )
  }

  const Header = ({name}: {name: string}): JSX.Element => {
    return (
      <h1>{name}</h1>
    )

  }

  const Content = ({parts}: {parts: CoursePart[]}): JSX.Element => {
    return (
      <>
        {parts.map(part => <Part part={part}/>)}
      </>
    )
  }

  const Total = ({total}: {total: number}): JSX.Element => {
    return (
      <p>
        Number of exercises {total}
      </p>
    )
  }

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;