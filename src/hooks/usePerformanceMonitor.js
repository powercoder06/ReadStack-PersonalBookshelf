import { useEffect, useRef } from "react";
import logger from "../utils/logger";
import errorReporter from "../utils/errorReporter";

export const usePerformanceMonitor = componentName => {
  const renderStartTime = useRef(Date.now());
  const mountTime = useRef(null);

  useEffect(() => {
    mountTime.current = Date.now();
    const mountDuration = mountTime.current - renderStartTime.current;

    logger.performance(`${componentName} mount`, mountDuration, {
      component: componentName,
      type: "mount",
    });

    // Report slow mounts
    if (mountDuration > 1000) {
      errorReporter.reportPerformanceIssue(
        {
          name: `Slow mount: ${componentName}`,
          duration: mountDuration,
          threshold: 1000,
        },
        {
          component: componentName,
          type: "slow-mount",
        }
      );
    }

    return () => {
      const unmountTime = Date.now();
      const totalLifetime = unmountTime - mountTime.current;

      logger.performance(`${componentName} unmount`, totalLifetime, {
        component: componentName,
        type: "lifetime",
      });
    };
  }, [componentName]);

  const measureOperation = (operationName, operation) => {
    return async (...args) => {
      const startTime = Date.now();
      try {
        const result = await operation(...args);
        const duration = Date.now() - startTime;

        logger.performance(`${componentName}.${operationName}`, duration, {
          component: componentName,
          operation: operationName,
          type: "operation",
        });

        // Report slow operations
        if (duration > 2000) {
          errorReporter.reportPerformanceIssue(
            {
              name: `Slow operation: ${componentName}.${operationName}`,
              duration,
              threshold: 2000,
            },
            {
              component: componentName,
              operation: operationName,
            }
          );
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`${componentName}.${operationName} failed`, {
          component: componentName,
          operation: operationName,
          duration,
          error: error.message,
        });
        throw error;
      }
    };
  };

  return { measureOperation };
};
