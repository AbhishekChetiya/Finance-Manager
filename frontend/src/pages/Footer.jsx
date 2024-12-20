import { Instagram, Linkedin, Github, Mail } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <p className="text-gray-400">We are a company committed to empowering individuals and businesses by providing exceptional financial management services and tools. Our goal is to simplify finance management and help you make smarter financial decisions.                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-blue-700">Reach Out to Us</h3>
                        <p className="text-gray-600">Address: IET Campus, Lucknow, UP, India, 226021</p>
                        <p className="text-gray-600">Phone: +91-7068493259</p>
                        <p className="text-gray-600">Email: a1.bhishek.p1.andey@gmail.com</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="https://github.com/AbhishekChetiya" target="_blank" className="text-gray-400 hover:text-white">
                                <Github className="h-6 w-6" />
                            </a>
                            <a href="https://www.instagram.com/aabbhishek_pandey/" target="_blank" className="text-gray-400 hover:text-white">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="https://www.linkedin.com/in/abhishek-pandey-0b41a9229/" target="_blank" className="text-gray-400 hover:text-white">
                                <Linkedin className="h-6 w-6" />
                            </a>
                            <a
                                href="mailto:a1.bhishek.p1.andey@gmail.com"
                                target="_blank"
                                className="text-gray-400 hover:text-white"
                            >
                                <Mail className="h-6 w-6" />
                            </a>

                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-400">&copy; 2024 Your Company Name. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

