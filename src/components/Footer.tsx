import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Image 
                className="h-12 w-12 mr-3" 
                src="/logo.png" 
                alt="Garden Gold Green - Logo Premium CBD"
                width={48}
                height={48}
              />
              <span className="text-white text-lg font-bold">GARDEN GOLD GREEN</span>
            </div>
            <p className="text-gray-400 text-sm">Nature's finest elixir, delivered.</p>
            <div className="flex space-x-4 mt-6">
              <span className="text-gray-400 hover:text-brand-gold cursor-pointer">
                <i className="fa-brands fa-instagram text-xl"></i>
              </span>
              <span className="text-gray-400 hover:text-brand-gold cursor-pointer">
                <i className="fa-brands fa-facebook text-xl"></i>
              </span>
              <span className="text-gray-400 hover:text-brand-gold cursor-pointer">
                <i className="fa-brands fa-twitter text-xl"></i>
              </span>
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Shop</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  CBD Oils
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Topicals
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Gummies
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Company</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Legal</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Shipping & Returns
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Garden Gold Green. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export function Footer() {
  return (
    <footer className="bg-black py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Image 
                className="h-12 w-12 mr-3" 
                src="/logo.png" 
                alt="Garden Gold Green - Logo Premium CBD"
                width={48}
                height={48}
              />
              <span className="text-white text-lg font-bold">GARDEN GOLD GREEN</span>
            </div>
            <p className="text-gray-400 text-sm">Nature's finest elixir, delivered.</p>
            <div className="flex space-x-4 mt-6">
              <span className="text-gray-400 hover:text-brand-gold cursor-pointer">
                <i className="fa-brands fa-instagram text-xl"></i>
              </span>
              <span className="text-gray-400 hover:text-brand-gold cursor-pointer">
                <i className="fa-brands fa-facebook text-xl"></i>
              </span>
              <span className="text-gray-400 hover:text-brand-gold cursor-pointer">
                <i className="fa-brands fa-twitter text-xl"></i>
              </span>
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Shop</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  CBD Oils
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Topicals
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Gummies
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Company</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Legal</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Shipping & Returns
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Garden Gold Green. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}