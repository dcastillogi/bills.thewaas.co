export const components: any = {
    blockquote: ({ children }: { children: React.ReactNode}) => {
        return (
            <blockquote className="border-l-4 border-primary/30 pl-4">
                {children}
            </blockquote>
        );
    },
    ul: ({ children }: { children: React.ReactNode}) => {
        return <ul className="list-disc pl-6 space-y-2.5">{children}</ul>;
    }
}