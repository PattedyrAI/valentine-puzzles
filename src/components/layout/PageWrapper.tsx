import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="flex-1 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
