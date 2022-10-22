import { Button, Result } from '@arco-design/web-react';
import { ErrorBoundary } from '@sentry/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  showDialog?: boolean;
  title?: string;
  subTitle?: string;
};

export const CustomErrorBoundary = ({ children, title, subTitle, showDialog }: Props) => {
  return (
    <ErrorBoundary
      showDialog={showDialog}
      fallback={
        <Result
          status="error"
          title={title || 'Error message'}
          subTitle={subTitle || 'Something went wrong. Please try again. '}
          extra={[
            <Button
              key="again"
              onClick={() => {
                window.location.reload();
              }}
            >
              Again
            </Button>
          ]}
        ></Result>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
