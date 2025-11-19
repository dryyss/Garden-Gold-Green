'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/contexts/TranslationContext'
import { LanguageSelector } from './LanguageSelector'

export function Footer() {
  const { t } = useTranslation()
  
  return (
    <footer className="bg-black py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 md:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Image 
                className="h-10 w-10 sm:h-12 sm:w-12 mr-3" 
                src="/logo.png" 
                alt="Garden Gold Green - Logo Premium CBD"
                width={48}
                height={48}
              />
              <span className="text-white text-base sm:text-lg font-bold">{t('header.title')}</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">{t('footer.description')}</p>
            <div className="flex space-x-4 mt-4 sm:mt-6 justify-center md:justify-start">
              <span className="text-gray-400 hover:text-brand-gold cursor-pointer">
                <i className="fa-brands fa-instagram text-lg sm:text-xl"></i>
              </span>
              <span className="text-gray-400 hover:text-brand-gold cursor-pointer">
                <i className="fa-brands fa-facebook text-lg sm:text-xl"></i>
              </span>
              <span className="text-gray-400 hover:text-brand-gold cursor-pointer">
                <i className="fa-brands fa-twitter text-lg sm:text-xl"></i>
              </span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h5 className="font-semibold text-white mb-4">{t('footer.categories')}</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=huiles-cbd" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('header.categories.oils')}
                </Link>
              </li>
              <li>
                <Link href="/products?category=fleurs-cbd" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('header.categories.flowers')}
                </Link>
              </li>
              <li>
                <Link href="/products?category=resines" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('header.categories.resins')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  Tous les produits
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h5 className="font-semibold text-white mb-4">{t('footer.quickLinks')}</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('header.user.trackOrder')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('header.navigation.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('header.navigation.contact')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('header.navigation.faq')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('header.navigation.blog')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h5 className="font-semibold text-white mb-4">{t('footer.legal')}</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="text-gray-400 hover:text-brand-gold text-sm cursor-pointer">
                  {t('footer.shipping')}
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <LanguageSelector variant="footer" />
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>{t('footer.copyright')}</p>
          <p className="mt-2">
            Créé et développé par{' '}
            <Link 
              href="https://andrysmagar.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              Andrys Magar
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}



