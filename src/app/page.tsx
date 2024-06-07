import Hero from "@/components/Hero"

export default function Home() {
    if (true) {
        // If user is not logged in, display welcome message to bills platform
        return <Hero />
    }

    // If user is logged in, display bills dashboard
    return (
        <div>
            <h1>Welcome to Bills</h1>
            <p>Manage your bills with ease</p>
        </div>
    )
}
