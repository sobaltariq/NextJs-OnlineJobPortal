const composeHOCs =
  (...hocs: any[]) =>
  (Component: React.ComponentType) => {
    return hocs.reduce((AccumulatedComponent, currentHOC) => {
      return currentHOC(AccumulatedComponent);
    }, Component);
  };

export default composeHOCs;
