import { PropsWithChildren } from 'react';
export default function({ children }: PropsWithChildren) {
    return (
        <div>
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-BgColor">
                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-Primary text-Tertiary shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    )
}