const controllerWrapper = (controller) => {
  const wrapper = async (req, res, next) => {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };

  return wrapper;
};

export default controllerWrapper;
